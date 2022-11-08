import Util from '../util/index.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { PodmanVersion } from '../type/podman.js';
import { ServiceType } from '../type/service.js';
import PodmanError from '../error/PodmanError.js';
import { spawnChildProcess } from '../util/general.js';
import AbstractService from './AbstractService.js';
import LogService from './LogService.js';

/**
 * Service that manages Podman
 */
export default class PodmanService extends AbstractService {
  private readonly logService: LogService;

  constructor(options: ElekIoCoreOptions, logService: LogService) {
    super(ServiceType.ASSET, options);

    this.logService = logService;
  }

  public info(): Promise<PodmanVersion> {
    return this.podman(['info'], true);
  }

  public version(): Promise<PodmanVersion> {
    return this.podman(['version'], true);
  }

  /**
   * Builds an image from given path and names it
   *
   * @param image Name of the image to build
   * @param path  Path of the image to build
   */
  public build(image: string, path: string): Promise<any> {
    return this.podman(['build', '--tag', `elek-io/${image}`, path]);
  }

  /**
   * Runs the specified image and removes it after
   *
   * @param image Name of the image to run
   */
  public run(image: string): Promise<any> {
    return this.podman(['run', '--rm', `elek-io/${image}`]);
  }

  public ps(): Promise<any> {
    return this.podman(['ps', '--all', '--size'], true);
  }

  private async podman(
    args: string[],
    jsonResponse: boolean = false
  ): Promise<any> {
    if (jsonResponse === true) {
      args = [...args, '--format=json'];
    }

    this.logService.debug('Recieved request to process podman command', {
      args,
    });

    try {
      let result = await spawnChildProcess('podman', args);

      if (jsonResponse === true) {
        result = JSON.parse(result);
      }

      this.logService.debug('Processed podman command', { args, result });
      return result;
    } catch (err) {
      const version = await this.version();
      const error = new PodmanError(
        `Podman (Client ${version.Client.Version} | Server ${
          version.Server.Version
        }) command "podman ${args.join(' ')}" failed with message:\n${err}`
      );
      this.logService.error(error.name, error);
      throw error;
    }
  }
}
