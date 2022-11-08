interface PodmanVersionObject {
  APIVersion: string;
  Version: string;
  GoVersion: string;
  GitCommit: string;
  BuiltTime: string;
  Built: number;
  OsArch: string;
}

export interface PodmanVersion {
  Client: PodmanVersionObject;
  Server: PodmanVersionObject;
}

export interface PodmanInfo {
  host: {};
  store: {};
  registries: {};
  plugins: {};
  version: PodmanVersionObject;
}
