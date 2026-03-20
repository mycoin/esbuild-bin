import { parseArgs } from "util";
import { UserArgs } from "./interfaces";

const defaltOptions: UserArgs = {
  entry: "@/index",
  production: false,
  write: true,
  clean: true,
  outdir: "dist",
  publicPrefix: "public",
  vendorChunk: false,
  platform: "browser",
  target: "es2020",
  minify: false,
  sourcemap: false,
  define: {},
  loader: {},
  plugins: [],
  library: false,
  logLevel: "info",
  analyze: false,

  cssExtract,
  dataUriLimit,
  copyPublicDir,

  hostname,
  port,
  hmr,
  proxy,
};

export default (args: string[]) => {
  const params = {};
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      port: { type: "string" },
      debug: { type: "boolean", default: true },
    },
  });
  return {
    values,
    action: "build",
  };
};
