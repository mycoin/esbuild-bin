import { readJSONSync, existsSync } from "fs-extra";
import { join } from "path";
import { Opts } from "./interfaces";
import { parseArgv } from "./util";

const defaultOptions: Required<Opts> = {
  // 构建上下文目录
  context: process.cwd(),
  // 入口文件
  entry: "@/index",
  // 路径别名配置
  alias: {
    "@": "./src",
  },
  // 模块解析扩展名列表
  resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  // JSX 预设框架名称
  jsx: "react",
  // 是否启用库打包模式
  library: false,
  // 外部模块列表
  externals: ["esbuild"],
  // 构建目标运行平台
  platform: "browser",
  // 产物输出文件夹路径
  outdir: "dist",
  // 全局常量注入定义
  define: {},
  // sourcemap 生成模式
  sourcemap: "external",
  // 是否开启模块树摇优化
  treeShaking: false,
  // 是否为生产构建环境
  production: false,
  // 是否开启文件监听构建
  watch: false,
  // 是否启动本地开发服务
  server: false,
  // 控制台日志输出级别
  logLevel: "info",
  // 法律注释模式
  legalComments: "external",
};

// 从配置中获取构建配置
const getPackageFields = () => {
  const { build } = readJSONSync(join(process.cwd(), "package.json"));
  const returnValue: Partial<Opts> = {};

  if (build && typeof build === "object") {
    for (const k in build) {
      if (k in defaultOptions) {
        returnValue[k] = build[k];
      }
    }
  }
  return returnValue;
};

export default (args: string[]) => {
  const argv = parseArgv(args, defaultOptions);
  // 切换到构建上下文目录
  if (argv.context) {
    if (existsSync(argv.context)) {
      process.chdir(argv.context);
    } else {
      throw new Error("Invalid context directory: " + argv.context);
    }
  }

  console.error(222, argv);

  // 从配置中获取构建配置
  const packageFields = getPackageFields();
  return {
    ...defaultOptions,
    ...packageFields,
    ...argv,
  };
};
