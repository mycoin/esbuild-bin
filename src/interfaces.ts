import type { BuildOptions, LogLevel, Platform } from "esbuild";

export type Primitive = string | number | boolean;
export type PrimitiveRecord = Record<string, Primitive | Primitive[]>;

export type Config = BuildOptions;
export type Opts = {
  // 构建上下文目录
  context?: string;
  // 入口文件路径
  entry?: string | Record<string, string>;
  // 路径别名配置
  alias?: Record<string, string>;
  // 模块解析扩展名列表
  resolveExtensions?: string[];
  // JSX 预设框架名称
  jsx?: "preserve" | "react" | "nano-jsx" | "vue" | string;
  // 是否启用库打包模式
  library?: boolean;
  // 外部模块列表
  externals?: string[];
  // 构建目标运行平台
  platform?: Platform;
  // 产物输出文件夹路径
  outdir?: string;
  // 全局常量注入定义
  define?: Record<string, Primitive>;
  // sourcemap 生成模式
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
  // 是否开启模块树摇优化
  treeShaking?: boolean;
  // 是否为生产构建环境
  production?: boolean;
  // 是否开启文件监听构建
  watch?: boolean;
  // 是否启动本地开发服务
  server?: boolean;
  // 控制台日志输出级别
  logLevel?: LogLevel;
  // 法律注释模式
  legalComments?: "none" | "inline" | "eof" | "linked" | "external";
};

// 全局环境变量类型定义
declare global {
  interface ImportMetaEnv {
    readonly NODE_ENV: "development" | "production";
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
