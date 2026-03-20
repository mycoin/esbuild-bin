var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var require_utils = __commonJS({
  "src/utils.ts"() {
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  defineConfig: () => defineConfig_default,
  normalize: () => normalize_default,
  parseArgs: () => parseArgs_default,
  run: () => run_default,
  utils: () => utils
});
module.exports = __toCommonJS(index_exports);

// src/defineConfig.ts
var defineConfig_default = () => {
};

// src/normalize.ts
var normalize_default = () => {
};

// src/parseArgs.ts
var import_util = require("util");
var defaltOptions = {
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
  proxy
};
var parseArgs_default = (args) => {
  const params = {};
  const { values, positionals } = (0, import_util.parseArgs)({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      port: { type: "string" },
      debug: { type: "boolean", default: true }
    }
  });
  return {
    values,
    action: "build"
  };
};

// src/run.ts
var run_default = async () => {
};

// src/index.ts
var utils = __toESM(require_utils());
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineConfig,
  normalize,
  parseArgs,
  run,
  utils
});
