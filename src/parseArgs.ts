import { resolve } from "path";
import { existsSync } from "fs-extra";
import { cosmiconfigSync } from "cosmiconfig";
import { CliOpts, Opts } from "./interfaces";
import { parseArgs } from "./util";

const defaultCliOpts: Required<CliOpts> = {
  // 构建上下文目录
  context: ".",
  // 产物输出文件夹路径
  outdir: "dist",
  // sourcemap 生成模式
  sourcemap: "external",
  // 是否为生产构建环境
  production: true,
  // 是否开启文件监听构建
  watch: false,
  // 是否启动本地开发服务
  server: false,
  // 控制台日志输出级别
  logLevel: "info",
};

// 加载用户配置
const getUserOpts = <T>(): Partial<T> => {
  const explorer = cosmiconfigSync("build", {
    searchPlaces: [
      "build.config.ts",
      "build.config.js",
      "build.config.cjs",
      "build.config.json",
      "package.json",
    ],
  });
  const result = explorer.search();
  if (result && result.config) {
    return result.config;
  } else {
    return null;
  }
};

// 切换到构建上下文目录
const chdirContext = (dir: string) => {
  if (!existsSync(dir)) {
    throw new Error("Context directory does not exist: " + dir);
  }
  process.chdir(dir);
};

export default (args: string[]) => {
  const params = parseArgs(args, defaultCliOpts);

  // 处理构建上下文目录
  if (params.context) {
    params.context = resolve(params.context);
  } else {
    params.context = process.cwd();
  }
  // 切换到构建上下文目录
  chdirContext(params.context);

  // 加载用户配置
  const userOpts = getUserOpts<Opts>();
  const returnValue: Opts = {
    ...defaultCliOpts,
    ...userOpts,
    ...params,
  };
  return returnValue;
};
