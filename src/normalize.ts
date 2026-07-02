import { sassPlugin } from "esbuild-sass-plugin";
import progressPlugin from "esbuild-plugin-progress";
import { wasmLoader } from "esbuild-plugin-wasm";
import { Config, Opts } from "./interfaces";

type Normalize = (opts: Opts, config: Config) => void;

const normalizers: Normalize[] = [
  // 处理入口文件
  (opts, config) => {
    const { entry } = opts;
    if (typeof entry === "string") {
      config.entryPoints = [entry];
    } else if (entry && typeof entry === "object") {
      config.entryPoints = entry;
    }
  },

  // 处理 JSX 预设框架名称
  (opts, config) => {
    const { jsx } = opts;
    const automaticMap: Record<string, string> = {
      react: "react",
      vue: "vue",
      "nano-jsx": "nano-jsx/esm",
    };
    if (jsx === "preserve") {
      config.jsx = "preserve";
    } else if (jsx) {
      config.jsx = "automatic";
      config.jsxImportSource = automaticMap[jsx] || jsx;
    }
  },

  // 处理全局常量注入定义
  (opts, config) => {
    const { define, platform } = opts;
    const returnValue: Record<string, string> = {};

    for (const key in define) {
      const name =
        platform === "browser"
          ? "import.meta.env." + key
          : "process.env." + key;
      returnValue[name] = JSON.stringify(define[key]);
    }
    config.define = returnValue;
  },

  // 处理插件
  (opts, config) => {
    const { plugins } = config;
    plugins.push(
      wasmLoader({
        mode: "embedded",
      }),
      progressPlugin(),
      sassPlugin({
        style: "compressed",
        type: "style",
      }),
    );
  },
];

export default (opts: Opts): Config => {
  const {
    // 路径别名配置
    alias,
    // 模块解析扩展名列表
    resolveExtensions,
    // 是否启用库打包模式
    library,
    // 构建目标运行平台
    platform,
    // 产物输出文件夹路径
    // 是否开启模块树摇优化
    treeShaking,
    // 是否为生产构建环境
    legalComments,
  } = opts;

  const config: Config = {
    // 构建上下文目录
    absWorkingDir: process.cwd(),
    // 入口文件
    entryPoints: null,
    // 路径别名配置
    alias,
    // 模块解析扩展名列表
    resolveExtensions,
    // 产物输出文件夹路径
    // 是否开启代码打包
    bundle: true,
    // 代码格式
    format: library ? "esm" : "iife",
    // 构建目标运行平台
    platform,
    // 目标浏览器版本
    target: ["esnext"],
    // 是否开启代码压缩
    // sourcemap 生成模式
    // 是否开启模块树摇优化
    treeShaking,
    // 全局常量注入定义
    define: {},
    // 外部依赖列表
    external: [],
    // 插件列表
    plugins: [],
    // 法律注释
    legalComments,
    // 控制台日志输出级别
  };

  // 应用归一化函数
  for (const fn of normalizers) {
    fn(opts, config);
  }
  return config;
};
