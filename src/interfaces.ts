export type KV<T = string | number | boolean> = Record<string, T>;
export type KVS = KV<string>;

export type Action = "dev" | "build";
export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";
export type MinifyOptions = boolean | "whitespace" | "identifiers" | "syntax";
export type SourcemapOptions = boolean | "inline" | "external";
export type NormalizeOpts = {
  action: Action;
  entry: Record<string, string>;
  production: boolean;
  write: boolean;
  clean: boolean;
  outdir: string;
  publicPrefix: string;
  vendorChunk?: string;
};

export type UserArgs = {
  entry?: Record<string, string>;
  production?: boolean;
  write?: boolean;
  clean?: boolean;
  outdir?: string;
  publicPrefix?: string;
  vendorChunk?: string;
  platform?: "browser"; // 目前仅支持 browser
  target?: string | string[];
  minify?: MinifyOptions;
  sourcemap?: SourcemapOptions;
  define?: Record<string, any>;
  loader?: Record<string, string>;
  plugins?: any[];
  library?: boolean;
  logLevel?: LogLevel;
  analyze?: boolean | "json";

  cssExtract?: boolean;
  dataUriLimit?: number;
  copyPublicDir?: boolean;

  hostname?: string;
  port?: number;
  hmr?: boolean;
  proxy?: Record<string, any>;
};
