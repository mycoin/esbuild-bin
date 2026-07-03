import { Opts, CliOpts, UserOpts } from "./interfaces";
import { lookupConfig, parseArgs } from "./util";

const defaultCliOpts: Required<CliOpts> = {
  // 产物输出文件夹路径
  outdir: "dist",
  // 构建上下文目录
  context: ".",
  // sourcemap 生成模式
  sourcemap: false,
  // 是否为生产构建环境
  production: false,
  // 是否开启文件监听构建
  watch: false,
  // 是否启动本地开发服务
  server: false,
  // 控制台日志输出级别
  logLevel: "verbose",
};

const defaultUserOpts: Required<UserOpts> = {
  // 入口文件路径
  entry: [],
  // 路径别名配置
  alias: {},
  // 模块解析扩展名列表
  resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  // 产物输出文件夹路径
  outdir: "dist",

  // 字符集
  charset: "utf8",
  // 全局常量注入定义
  define: {},
  // 外部模块列表
  external: [],
  // 构建目标运行平台
  platform: "browser",

  // 是否启用库打包模式
  library: false,
  // 库名称
  libraryName: null,
  // 库导出模式
  libraryPackages: "bundle",
  // 库导出类型
  libraryFormats: ["esm"],

  // JSX 预设框架名称
  jsx: "preserve",
  // JSX 工厂函数名称
  jsxFactory: null,
  // JSX 片段函数名称
  jsxFragment: null,
  // JSX 导入源路径
  jsxImportSource: null,

  // 公共路径
  publicPath: "./",
  // 插件列表
  plugins: [],
  // 是否开启模块树摇优化
  treeShaking: false,
  // 法律注释模式
  legalComments: "external",
};

export default (args: string[]): Opts => {
  const cliOpts = parseArgs(args, defaultCliOpts);
  const { context } = cliOpts;

  // 切换到构建上下文目录
  if (context) {
    process.chdir(context);
  }

  // 查找用户配置文件
  const handler = lookupConfig();
  // 加载用户配置
  const userConfig =
    typeof handler == "function"
      ? handler({
          ...defaultCliOpts,
          ...cliOpts,
        })
      : handler;

  const templates = { ...defaultUserOpts, ...defaultCliOpts };
  const returnValue: UserOpts = {
    // 合并用户配置和命令行选项
    ...userConfig,
    // 合并命令行选项
    ...cliOpts,
  };

  for (const k in returnValue) {
    if (typeof templates[k] == "undefined") {
      throw new Error(`Unknown option ` + k);
    }
  }
  return {
    ...templates,
    ...returnValue,
  };
};
