/**
 * Signature git uses to identify users
 */
export interface GitSignature {
  name: string;
  email: string;
}

export interface GitTag {
  name: string;
  message: string;
  author: GitSignature;
  timestamp: number;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: GitSignature;
  timestamp: number;
}

/**
 * Icons for usage in commit messages
 *
 * @see https://gitmoji.dev/
 */
export enum GitCommitIcon {
  INIT = ':tada:',
  CREATE = ':heavy_plus_sign:',
  UPDATE = ':wrench:',
  DELETE = ':fire:',
}

export interface GitInitOptions {
  /**
   * Use the specified name for the initial branch in the newly created repository. If not specified, fall back to the default name (currently master, but this is subject to change in the future; the name can be customized via the init.defaultBranch configuration variable).
   */
  initialBranch: string;
}

export interface GitCloneOptions {
  /**
   * Create a shallow clone with a history truncated to the specified number of commits. Implies --single-branch unless --no-single-branch is given to fetch the histories near the tips of all branches. If you want to clone submodules shallowly, also pass --shallow-submodules.
   */
  depth: number;
  /**
   * Clone only the history leading to the tip of a single branch, either specified by the --branch option or the primary branch remote’s HEAD points at. Further fetches into the resulting repository will only update the remote-tracking branch for the branch this option was used for the initial cloning. If the HEAD at the remote did not point at any branch when --single-branch clone was made, no remote-tracking branch is created.
   */
  singleBranch: boolean;
  /**
   * Instead of pointing the newly created HEAD to the branch pointed to by the cloned repository’s HEAD, point to <name> branch instead. In a non-bare repository, this is the branch that will be checked out. --branch can also take tags and detaches the HEAD at that commit in the resulting repository.
   */
  branch: string;
}

export interface GitSwitchOptions {
  /**
   * If true, creates a new local branch and then switches to it
   *
   * @see https://git-scm.com/docs/git-switch#Documentation/git-switch.txt---createltnew-branchgt
   */
  isNew: boolean;
}

export interface GitLogOptions {
  /**
   * Limit the result to given number of commits
   */
  limit?: number;
  /**
   * Only list commits that are between given SHAs or tag names
   *
   * Note that the commits of from and to are not included in the result
   */
  between?: {
    /**
     * From the oldest commit
     */
    from: string;
    /**
     * To the newest commit
     *
     * Defaults to the current HEAD
     */
    to?: string;
  };
}
