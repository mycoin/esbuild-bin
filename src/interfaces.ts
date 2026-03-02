export type Action = "dev" | "build";
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
