import { join } from "path";
import { Plugin } from "esbuild";
import { readJSONSync } from "fs-extra";

import { sassPlugin } from "esbuild-sass-plugin";
import progressPlugin from "esbuild-plugin-progress";
import { wasmLoader } from "esbuild-plugin-wasm";

import { Config, Opts } from "./interfaces";

type Normalize = (config: Config, opts: Opts) => void;

const normalizers: Normalize[] = [
  // 处理入口文件
  (config, opts) => {
    const { entry } = opts;
    if (typeof entry === "string") {
      config.entryPoints = [entry];
    } else if (entry && typeof entry === "object") {
      config.entryPoints = entry;
    }
  },

  // 处理 JSX 预设框架名称
  (config, opts) => {
    const { jsx, jsxFactory, jsxFragment, jsxImportSource } = opts;

    if (jsx === "preserve") {
      config.jsx = "preserve";
    } else if (jsx === "automatic") {
      config.jsx = "automatic";
      config.jsxImportSource = jsxImportSource;
    } else if (jsx === "transform") {
      config.jsx = "transform";
      config.jsxFactory = jsxFactory;
      config.jsxFragment = jsxFragment;
    }
  },

  // 处理库导出模式
  (config, opts) => {
    const { context, library, libraryName, libraryPackages } = opts;
    const packageJson = readJSONSync(join(context, "package.json"));

    // 库导出模式
    if (library) {
      config.globalName = libraryName || packageJson.name;
      config.packages = libraryPackages;
    }
  },

  // 处理全局常量注入定义
  (config, opts) => {
    const { define, production, platform } = opts;
    const returnValue: Record<string, string> = {};
    const defination = {
      ...define,
      // 是否为生产环境
      PROD: production,
      // 是否为开发环境
      DEV: !production,
    };
    for (const key in defination) {
      const name =
        platform === "browser"
          ? "import.meta.env." + key
          : "process.env." + key;
      returnValue[name] = JSON.stringify(defination[key]);
    }
    // 全局常量注入定义
    config.define = returnValue;
  },

  // 处理代码压缩, 写入文件系统
  (config, opts) => {
    const { production } = opts;
    if (production) {
      config.minify = true;
    }
  },

  // 处理插件列表
  (config, opts) => {
    const plugins: Plugin[] = [
      ...opts.plugins,

      // 显示构建进度
      progressPlugin(),
      // 处理 Sass 样式
      sassPlugin(),
      // 处理 WebAssembly 模块
      wasmLoader(),
    ];
    config.plugins = plugins.filter((e) => e && e.name);
  },
];

// 归一化命令行选项
export default (opts: Opts): Config => {
  const {
    // 路径别名配置
    alias,
    // 模块解析扩展名列表
    resolveExtensions,
    // 外部模块列表
    external,
    // 构建目标运行平台
    platform,
    // 产物输出文件夹路径
    outdir,
    // 公共路径
    publicPath,
    // sourcemap 生成模式
    sourcemap,
    // 是否开启模块树摇优化
    treeShaking,
    // 控制台日志输出级别
    logLevel,
    // 法律注释模式
    legalComments,
  } = opts;

  const config: Config = {
    // 入口文件路径
    entryPoints: null,
    // 路径别名配置
    alias: {
      ...alias,
    },

    // 是否启用库打包模式
    bundle: true,
    // 模块解析扩展名列表
    resolveExtensions,
    // 产物输出文件夹路径
    outdir,
    // 是否写入文件系统
    write: true,

    // 字符集
    charset: "utf8",
    // 全局常量注入定义
    define: {},
    // 外部模块列表
    external,
    // 构建目标运行平台
    platform,

    // 公共路径
    publicPath,
    // 插件列表
    plugins: [],
    // 工作目录
    absWorkingDir: process.cwd(),
    // 是否开启模块树摇优化
    treeShaking,
    // sourcemap 生成模式
    sourcemap,
    // 法律注释模式
    legalComments,
    // 控制台日志输出级别
    logLevel,
  };

  // 应用归一化函数
  for (const method of normalizers) {
    method(config, opts);
  }
  return config;
};
