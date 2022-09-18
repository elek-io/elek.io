import Util from '../util/index.js';
import { GitProcess, IGitResult } from 'dugite';
import AbstractService from './AbstractService.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { ServiceType } from '../type/service.js';
import {
  GitCloneOptions,
  GitCommit,
  GitInitOptions,
  GitLogOptions,
  GitSwitchOptions,
  GitTag,
} from '../type/git.js';
import GitError from '../error/GitError.js';
import LogService from './LogService.js';
import trim from 'lodash/trim.js';
import PQueue from 'p-queue';

/**
 * Service that manages Git functionality
 *
 * Uses dugite Node.js bindings for Git to be fully compatible
 * and be able to leverage Git LFS functionality
 * @see https://github.com/desktop/dugite
 *
 * Heavily inspired by the GitHub Desktop app
 * @see https://github.com/desktop/desktop
 */
export default class GitService extends AbstractService {
  private logService: LogService;
  private queueCount: number;
  private queue: PQueue.default;

  public constructor(options: ElekIoCoreOptions, logService: LogService) {
    super(ServiceType.GIT, options);

    this.logService = logService;
    this.queue = new PQueue.default({
      concurrency: 1,
    });
    this.queueCount = 0;
    this.queue.on('add', (item) => {
      this.logService.debug(
        `Item added. Size: ${this.queue.size} Pending: ${this.queue.pending}`,
        { item }
      );
    });
    this.queue.on('active', (item) => {
      this.logService.debug(
        `Working on item #${++this.queueCount}. Size: ${
          this.queue.size
        } Pending: ${this.queue.pending}`,
        { item }
      );
    });
    // this.queue.on('completed', (item) => {
    //   this.logService.debug(`Completed item`, {item});
    // });
    // this.queue.on('error', (item) => {
    //   this.logService.debug(`Error while working on item`, {item});
    // });
  }

  /**
   * Returns the currently used version of Git
   *
   * @param path Path to the repository
   */
  private async version(path: string): Promise<string> {
    const result = await this.git(path, ['--version']);
    return result.stdout.replace('git version', '').trim();
  }

  /**
   * Create an empty Git repository or reinitialize an existing one
   *
   * @see https://git-scm.com/docs/git-init
   *
   * @param path    Path to initialize in. Fails if path does not exist
   * @param options Options specific to the init operation
   */
  public async init(
    path: string,
    options?: Partial<GitInitOptions>
  ): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to initialize a git repository',
      { path, options },
      projectId
    );

    let args = ['init'];

    if (options?.initialBranch) {
      args = [...args, `--initial-branch=${options.initialBranch}`];
    }

    await this.git(path, args);
    await this.setLocalConfig(path);
    await this.installLfs(path);

    this.logService.debug(
      'Initialized git repository',
      { path, options, args },
      projectId
    );
  }

  /**
   * Clone a repository into a directory
   *
   * @see https://git-scm.com/docs/git-clone
   *
   * @todo Implement progress callback / events
   *
   * @param url     The remote repository URL to clone from
   * @param path    The destination path for the cloned repository.
   *                Which is only working if the directory is existing and empty.
   * @param options Options specific to the clone operation
   */
  public async clone(
    url: string,
    path: string,
    options?: Partial<GitCloneOptions>
  ): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to clone a git repository',
      { url, path, options },
      projectId
    );

    let args = ['clone', '--progress'];

    if (options?.branch) {
      args = [...args, '--branch', options.branch];
    }

    if (options?.depth) {
      args = [...args, '--depth', options.depth.toString()];
    }

    if (options?.singleBranch === true) {
      args = [...args, '--single-branch'];
    }

    await this.git(path, [...args, url, '.']);
    await this.setLocalConfig(path);

    this.logService.debug(
      'Cloned git repository',
      { url, path, options, args },
      projectId
    );
  }

  /**
   * Add file contents to the index
   *
   * @see https://git-scm.com/docs/git-add
   *
   * @param path  Path to the repository
   * @param files Files to add
   */
  public async add(path: string, files: string[]): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to add file contents to the git index',
      { path, files },
      projectId
    );

    const args = ['add', '--', ...files];

    await this.git(path, args);

    this.logService.debug(
      'Added file contents to the git index',
      { path, files, args },
      projectId
    );
  }

  /**
   * Switch branches
   *
   * @see https://git-scm.com/docs/git-switch/
   *
   * @param path    Path to the repository
   * @param name    Name of the branch to switch to
   * @param options Options specific to the switch operation
   */
  public async switch(
    path: string,
    name: string,
    options?: Partial<GitSwitchOptions>
  ): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to switch git branches',
      { path, name, options },
      projectId
    );

    await this.checkBranchOrTagName(path, name);

    let args = ['switch'];

    if (options?.isNew === true) {
      args = [...args, '--create', name];
    } else {
      args = [...args, name];
    }

    await this.git(path, args);

    this.logService.debug(
      'Switched git branches',
      { path, name, options, args },
      projectId
    );
  }

  /**
   * Restore working tree files
   *
   * @see https://git-scm.com/docs/git-restore/
   *
   * @todo It's probably a good idea to not use restore
   * for a use case where someone just wants to have a look
   * and maybe copy something from a deleted file.
   * We should use `checkout` without `add .` and `commit` for that
   *
   * @param path    Path to the repository
   * @param source  Git commit SHA or tag name to restore to
   * @param files   Files to restore
   */
  public async restore(
    path: string,
    source: string,
    files: string[]
  ): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to restore git working tree files',
      { path, source, files },
      projectId
    );

    const args = ['restore', `--source=${source}`, ...files];
    await this.git(path, args);

    this.logService.debug(
      'Restored git working tree files',
      { path, source, files, args },
      projectId
    );
  }

  /**
   * Fetch from and integrate with another repository or a local branch
   *
   * @see https://git-scm.com/docs/git-pull
   *
   * @param path Path to the repository
   */
  public async pull(path: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to pull git changes',
      { path },
      projectId
    );

    const args = ['pull'];
    await this.git(path, args);

    this.logService.debug('Pulled git changes', { path, args }, projectId);
  }

  /**
   * Record changes to the repository
   *
   * @see https://git-scm.com/docs/git-commit
   *
   * @param path    Path to the repository
   * @param message A message that describes the changes
   */
  public async commit(path: string, message: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to commit git changes',
      { path, message },
      projectId
    );

    const args = [
      'commit',
      `--message=${message}`,
      `--author=${this.options.signature.name} <${this.options.signature.email}>`,
    ];
    await this.git(path, args);

    this.logService.debug(
      'Commited git changes',
      { path, message, args },
      projectId
    );
  }

  /**
   * Creates a new tag
   *
   * @see https://git-scm.com/docs/git-tag#Documentation/git-tag.txt---annotate
   *
   * @param path    Path to the repository
   * @param name    Name of the new tag
   * @param message Message of the new tag
   * @param commit  Optional commit to create the tag on
   */
  public async createTag(
    path: string,
    name: string,
    message: string,
    commit?: GitCommit
  ): Promise<GitTag> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to create a new git tag',
      { path, name, message, commit },
      projectId
    );

    await this.checkBranchOrTagName(path, name);

    let args = ['tag', '--annotate', name];

    if (commit) {
      args = [...args, commit.hash];
    }

    args = [...args, '-m', message];

    await this.git(path, args);
    const tags = await this.listTags(path, name);

    this.logService.debug(
      'Created a new git tag',
      { path, name, message, commit, args },
      projectId
    );

    return tags[0] as GitTag;
  }

  /**
   * Gets all local tags or one specific if name is provided
   *
   * They are sorted by authordate of the commit, not the timestamp the tag is created.
   * This ensures tags are sorted correctly in the timeline of their commits.
   *
   * @see https://git-scm.com/docs/git-for-each-ref
   *
   * @param path Path to the repository
   * @param name Optional tag name to resolve
   */
  public async listTags(path: string, name?: string): Promise<GitTag[]> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to list git tags',
      { path, name },
      projectId
    );

    if (name) {
      await this.checkBranchOrTagName(path, name);
    }

    const args = [
      'for-each-ref',
      '--sort=-*authordate',
      '--format=%(refname:short)|%(subject)|%(*authorname)|%(*authoremail)|%(*authordate:unix)',
      'refs/tags',
    ];
    const result = await this.git(path, args);

    const noEmptyLinesArr = result.stdout.split('\n').filter((line) => {
      return line !== '';
    });

    const lineObjArr = noEmptyLinesArr.map((line) => {
      const lineArray = line.split('|');
      return {
        name: lineArray[0],
        message: lineArray[1],
        author: {
          name: lineArray[2],
          email: lineArray[3],
        },
        timestamp:
          typeof lineArray[4] === 'string' ? parseInt(lineArray[4]) : undefined,
      };
    });

    const namedObjArr = lineObjArr.filter((tag) => {
      if (name) {
        return tag.name === name;
      } else {
        return true;
      }
    });

    const gitTags = namedObjArr.filter(this.isGitTag);

    this.logService.debug(
      'Listed git tags',
      { path, name, args, gitTags },
      projectId
    );

    return gitTags;
  }

  /**
   * Deletes a tag
   *
   * @see https://git-scm.com/docs/git-tag#Documentation/git-tag.txt---delete
   *
   * @param path Path to the repository
   * @param name Name of the tag to delete
   */
  public async deleteTag(path: string, name: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to delete a git tag',
      { path, name },
      projectId
    );

    await this.checkBranchOrTagName(path, name);
    const args = ['tag', '--delete', name];
    await this.git(path, args);

    this.logService.debug('Deleted git tag', { path, name, args }, projectId);
  }

  /**
   * Gets local commit history
   *
   * @see https://git-scm.com/docs/git-log
   *
   * @todo Check if there is a need to trim the git commit message of chars
   * @todo Use this method in a service. Decide if we need a HistoryService for example
   *
   * @param path    Path to the repository
   * @param options Options specific to the log operation
   */
  public async log(
    path: string,
    options?: Partial<GitLogOptions>
  ): Promise<GitCommit[]> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to log all git commits',
      { path, options },
      projectId
    );

    let args = ['log'];

    if (options?.between?.from) {
      args = [
        ...args,
        `${options.between.from}...${options.between.to || 'HEAD'}`,
      ];
    }

    if (options?.limit) {
      args = [...args, `--max-count=${options.limit}`];
    }

    const result = await this.git(path, [
      ...args,
      '--format=%H|%s|%an|%ae|%at',
    ]);

    const noEmptyLinesArr = result.stdout.split('\n').filter((line) => {
      return line !== '';
    });

    const lineObjArr = noEmptyLinesArr.map((line) => {
      const lineArray = line.split('|');
      return {
        hash: lineArray[0],
        message: lineArray[1],
        author: {
          name: lineArray[2],
          email: lineArray[3],
        },
        timestamp:
          typeof lineArray[4] === 'string' ? parseInt(lineArray[4]) : undefined,
      };
    });

    const gitCommit = lineObjArr.filter(this.isGitCommit);

    this.logService.debug(
      'Logged git commits',
      { path, options, args, gitCommit },
      projectId
    );

    return gitCommit;
  }

  /**
   * Returns a timestamp of given files creation
   *
   * Git only returns the timestamp the file was added,
   * which could be different from the file being created.
   * But since file operations will always be committed
   * immediately, this is practically the same.
   *
   * @param path Path to the repository
   * @param file File to get timestamp from
   */
  public async getFileCreatedTimestamp(path: string, file: string) {
    const result = await this.git(path, [
      'log',
      '--diff-filter=A',
      '--follow',
      '--format=%at',
      '--max-count=1',
      '--',
      file,
    ]);
    return parseInt(result.stdout);
  }

  /**
   * Returns a timestamp of the files last modification
   *
   * @param path Path to the repository
   * @param file File to get timestamp from
   */
  public async getFileLastUpdatedTimestamp(path: string, file: string) {
    const result = await this.git(path, [
      'log',
      '--follow',
      '--format=%at',
      '--max-count=1',
      '--',
      file,
    ]);
    return parseInt(result.stdout);
  }

  /**
   * Returns created and updated timestamps from given file
   *
   * @param path Path to the project
   * @param file Path to the file
   */
  public async getFileCreatedUpdatedMeta(path: string, file: string) {
    const meta = await Promise.all([
      this.getFileCreatedTimestamp(path, file),
      this.getFileLastUpdatedTimestamp(path, file),
    ]);
    return {
      created: meta[0],
      updated: meta[1],
    };
  }

  /**
   * A reference is used in Git to specify branches and tags.
   * This method checks if given name matches the required format
   *
   * @see https://git-scm.com/docs/git-check-ref-format
   *
   * @param path Path to the repository
   * @param name Name to check
   */
  private async checkBranchOrTagName(path: string, name: string) {
    await this.git(path, ['check-ref-format', '--allow-onelevel', name]);
  }

  /**
   * Installs LFS support and starts tracking
   * all files inside the lfs folder
   *
   * @param path Path to the repository
   */
  private async installLfs(path: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to install git LFS',
      { path },
      projectId
    );

    await this.git(path, ['lfs', 'install']);
    await this.git(path, ['lfs', 'track', 'lfs/*']);

    this.logService.debug('Installed git LFS', { path }, projectId);
  }

  /**
   * Sets the git config of given local repository from ElekIoCoreOptions
   *
   * @param path Path to the repository
   */
  private async setLocalConfig(path: string) {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to set local git config',
      { path },
      projectId
    );

    const userNameArgs = [
      'config',
      '--local',
      'user.name',
      this.options.signature.name,
    ];
    const userEmailArgs = [
      'config',
      '--local',
      'user.email',
      this.options.signature.email,
    ];
    await this.git(path, userNameArgs);
    await this.git(path, userEmailArgs);

    this.logService.debug(
      'Finished setting local git config',
      { path, userNameArgs, userEmailArgs },
      projectId
    );
  }

  /**
   * Returns false if given key does not exist in obj,
   * the value of key is not of type string,
   * or the value of key is an empty string
   *
   * @todo this name is ridiculous
   *
   * @param obj The object to check
   * @param key The key to check
   */
  private isObjWithKeyAndValueOfString(obj: any, key: string) {
    if (!obj[key] || typeof obj[key] !== 'string' || trim(obj[key]) === '') {
      return false;
    }
    return true;
  }

  /**
   * Type guard for GitTag
   *
   * @note currently does not include a check if additional keys are present
   *
   * @param obj The object to check
   */
  private isGitTag(obj: any): obj is GitTag {
    if (!this.isObjWithKeyAndValueOfString(obj, 'name')) {
      this.logService.error('Git tag object does not contain a valid name', {
        obj,
      });
      return false;
    }
    if (!this.isObjWithKeyAndValueOfString(obj, 'message')) {
      this.logService.error('Git tag object does not contain a valid message', {
        obj,
      });
      return false;
    }
    if (!obj.author || !this.isObjWithKeyAndValueOfString(obj.author, 'name')) {
      this.logService.error(
        'Git tag object does not contain a valid author name',
        { obj }
      );
      return false;
    }
    if (
      !obj.author ||
      !this.isObjWithKeyAndValueOfString(obj.author, 'email')
    ) {
      this.logService.error(
        'Git tag object does not contain a valid author email',
        { obj }
      );
      return false;
    }
    if (
      !obj.timestamp ||
      typeof obj.timestamp !== 'number' ||
      obj.timestamp === 0
    ) {
      this.logService.error(
        'Git tag object does not contain a valid timestamp',
        { obj }
      );
      return false;
    }
    return true;
  }

  /**
   * Type guard for GitCommit
   *
   * @note currently does not include a check if additional keys are present
   *
   * @param obj The object to check
   */
  private isGitCommit(obj: any): obj is GitCommit {
    if (!this.isObjWithKeyAndValueOfString(obj, 'hash')) {
      this.logService.error('Git commit object does not contain a valid hash', {
        obj,
      });
      return false;
    }
    if (!this.isObjWithKeyAndValueOfString(obj, 'message')) {
      this.logService.error(
        'Git commit object does not contain a valid message',
        { obj }
      );
      return false;
    }
    if (!obj.author || !this.isObjWithKeyAndValueOfString(obj.author, 'name')) {
      this.logService.error(
        'Git commit object does not contain a valid author name',
        { obj }
      );
      return false;
    }
    if (
      !obj.author ||
      !this.isObjWithKeyAndValueOfString(obj.author, 'email')
    ) {
      this.logService.error(
        'Git commit object does not contain a valid author email',
        { obj }
      );
      return false;
    }
    if (
      !obj.timestamp ||
      typeof obj.timestamp !== 'number' ||
      obj.timestamp === 0
    ) {
      this.logService.error(
        'Git commit object does not contain a valid timestamp',
        { obj }
      );
      return false;
    }
    return true;
  }

  /**
   * Wraps the execution of any git command for logging
   *
   * @param path Path to the repository
   * @param args Arguments to execute under the `git` command
   */
  private async git(path: string, args: string[]): Promise<IGitResult> {
    const projectId = Util.fromPath.projectId(path);
    this.logService.debug(
      'Recieved request to process git command',
      { path, args },
      projectId
    );

    const result = await this.queue.add(() => GitProcess.exec(args, path));
    // const result = await GitProcess.exec(args, path);

    this.logService.debug('Processed git command', { path, args }, projectId);

    if (result.exitCode !== 0) {
      const version = await this.version(path);
      const error = new GitError(
        `Git (${version}) command "git ${args.join(' ')}" failed with code ${
          result.exitCode
        } and message:\n${result.stderr}`
      );

      this.logService.error(error.name, error, projectId);
    }

    return result;
  }
}
