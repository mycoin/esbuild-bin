import type {
  BuildOptions,
  Charset,
  Format,
  LogLevel,
  Platform,
  Plugin,
} from "esbuild";

export type Primitive = string | number | boolean;
export type Config = BuildOptions;

// 所有暴露给用户的选项类型
export type Opts = CliOpts & UserOpts;

// 命令行选项类型定义
export type CliOpts = {
  // 产物输出文件夹路径
  outdir?: string;
  // 构建上下文目录
  context?: string;
  // sourcemap 生成模式
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
  // 是否开启文件监听构建
  watch?: boolean;
  // 是否启动本地开发服务
  server?: boolean;
  // 是否为生产构建环境
  production?: boolean;
  // 控制台日志输出级别
  logLevel?: LogLevel;
};

// 自定义选项类型定义
export type UserOpts = {
  // 入口文件路径
  entry?: string | string[] | Record<string, string>;
  // 路径别名配置
  alias?: Record<string, string>;
  // 模块解析扩展名列表
  resolveExtensions?: string[];
  // 产物输出文件夹路径
  outdir?: string;

  // 字符集
  charset?: Charset;
  // 全局常量注入定义
  define?: Record<string, Primitive>;
  // 外部模块列表
  external?: string[];
  // 构建目标运行平台
  platform?: Platform;

  // 是否启用库打包模式
  library?: boolean;
  // 库名称
  libraryName?: string;
  // 库导出模式
  libraryPackages?: "bundle" | "external";
  // 库导出类型
  libraryFormats?: Format[];

  // JSX 预设框架名称
  jsx?: "transform" | "preserve" | "automatic";
  // JSX 工厂函数名称
  jsxFactory?: string;
  // JSX 片段函数名称
  jsxFragment?: string;
  // JSX 导入源路径
  jsxImportSource?: string;

  // 公共路径
  publicPath?: string;
  // 插件列表
  plugins?: Plugin[];
  // 是否开启模块树摇优化
  treeShaking?: boolean;
  // 法律注释模式
  legalComments?: "none" | "inline" | "eof" | "linked" | "external";
};

// 全局环境变量类型定义
declare global {
  interface ImportMetaEnv {
    readonly NODE_ENV: "development" | "production";

    [key: string]: Primitive;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
