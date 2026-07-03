# esbuild-bin 开发文档

## 项目概览

一个基于 **esbuild** 的轻量级前端构建工具，专注于**浏览器运行项目**和 **npm 库构建**两类核心场景。设计原则：极少依赖、行为可预测、配置透明、性能优先。

## 文件结构与职责

| 文件 | 职责 |
|------|------|
| [cli.js](cli.js) | CLI 入口，shebang 脚本，串联 `parseArgs → normalize → run` |
| [src/index.ts](src/index.ts) | 公共 API 导出：`normalize`、`parseArgs`、`run` |
| [src/interfaces.ts](src/interfaces.ts) | 类型定义：`Opts`、`CliOpts`、`UserOpts`、`Config`、全局环境变量声明 |
| [src/parseArgs.ts](src/parseArgs.ts) | 参数解析：合并 CLI 参数、用户配置文件、默认值 |
| [src/normalize.ts](src/normalize.ts) | 配置归一化：将 `Opts` 转换为 esbuild 的 `BuildOptions` |
| [src/run.ts](src/run.ts) | 构建执行：调用 esbuild `context()`，支持 watch 和单次构建 |
| [src/util.ts](src/util.ts) | 工具函数：配置文件查找（cosmiconfig）、命令行参数解析、库名转换 |

## 核心流程

1. **cli.js** — 解析 `process.argv`，调用 `parseArgs` 得到 `Opts`
2. **parseArgs.ts** — 合并默认 CLI 选项（`outdir: "dist"`, `context: "."`, `sourcemap: false` 等），通过 cosmiconfig 查找 `build.config.{ts,js,cjs,json}` 或 `package.json`，按优先级合并：`defaultUserOpts → defaultCliOpts → 用户配置 → CLI参数`，并剔除 null 值
3. **normalize.ts** — 通过 6 个 normalizer 函数将 `Opts` 转换为 esbuild `Config`：
   - 处理入口文件（支持 string / array / record）
   - 处理 JSX 预设（preserve / automatic / transform）
   - 处理库导出模式（从 package.json 读取 name）
   - 处理全局常量注入（`import.meta.env.PROD/DEV` 或 `process.env.*`）
   - production 模式下启用 minify
   - 注入进度插件（esbuild-plugin-progress）和 Sass 插件（esbuild-sass-plugin）
4. **run.ts** — 调用 `esbuild.context(config)`，watch 模式持续监听，否则 rebuild 后 dispose

## 关键类型

- **CliOpts** — 命令行参数（outdir, context, sourcemap, watch, server, production, logLevel）
- **UserOpts** — 用户配置参数（entry, alias, resolveExtensions, define, external, platform, library, jsx, publicPath, plugins 等）
- **Opts** = `CliOpts & UserOpts`
- **Config** = esbuild 的 `BuildOptions`

## 技术栈

- `esbuild` — 核心构建引擎
- `cosmiconfig` — 配置文件查找
- `esbuild-sass-plugin` — Sass 编译
- `esbuild-plugin-progress` — 构建进度显示
- `fs-extra` — 文件操作
- `typescript` — 作为运行时依赖，用于 TS 配置文件支持
