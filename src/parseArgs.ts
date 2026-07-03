import { Opts, CliOpts, UserOpts } from "./interfaces.js";
import { lookupConfig, parseArgs } from "./util.js";

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
  logLevel: "info",
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
  library: null,
  // 库名称
  libraryName: null,
  // 库导出类型
  libraryFormats: null,

  // JSX 预设框架名称
  jsx: null,
  // JSX 工厂函数名称
  jsxFactory: null,
  // JSX 片段函数名称
  jsxFragment: null,
  // JSX 导入源路径
  jsxImportSource: null,

  // 公共路径
  publicPath: "/",
  // 插件列表
  plugins: [],
  // 法律注释模式
  legalComments: "external",
};

const getUserConfig = (opts: CliOpts): UserOpts => {
  // 查找用户配置文件
  const handler = lookupConfig();
  const returnValue: UserOpts = {};
  if (typeof handler === "function") {
    Object.assign(
      // 合并用户配置和命令行选项
      returnValue,
      // 执行用户配置函数
      handler({
        ...defaultCliOpts,
        ...opts,
      }),
    );
  } else if (handler && typeof handler === "object") {
    // 合并用户配置文件对象
    Object.assign(returnValue, handler);
  }

  return returnValue;
};

export default (args: string[]): Opts => {
  const cliOpts = parseArgs(args, defaultCliOpts);

  // 切换到构建上下文目录
  if (cliOpts.context) {
    process.chdir(cliOpts.context);
  }

  // 查找用户配置文件
  const returnValue: Opts = {
    ...defaultUserOpts,
    ...defaultCliOpts,
    ...getUserConfig(cliOpts),
    ...cliOpts,
  };

  // 过滤掉空值
  for (const k in returnValue) {
    if (returnValue[k] === null) {
      delete returnValue[k];
    }
  }
  return returnValue;
};
