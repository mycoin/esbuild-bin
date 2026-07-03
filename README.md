# esbuild-bin

基于 **esbuild** 的轻量级前端构建工具，专注**浏览器运行项目**与 **npm 库构建**两类场景。

## 安装

```bash
npm install -D esbuild-bin
```

## 使用

```bash
esbuild-bin --production
esbuild-bin --watch
esbuild-bin --library
```

## 配置文件

支持 `build.config.ts` / `build.config.js` / `build.config.cjs` / `build.config.json`，导出普通对象即可：

```ts
export default {
  entry: {
    index: "src/index.tsx",
  },
};
```

不提供 `defineConfig` 包装，避免多余抽象。

## 参数

### CLI 参数

| 参数         | 类型                          | 默认值   | 说明             |
| ------------ | ----------------------------- | -------- | ---------------- |
| `outdir`     | string                        | `"dist"` | 产物输出目录     |
| `context`    | string                        | `"."`    | 构建上下文目录   |
| `sourcemap`  | boolean \| "linked" \| "inline" \| "external" \| "both" | `false` | sourcemap 模式 |
| `watch`      | boolean                       | `false`  | 文件监听构建     |
| `production` | boolean                       | `false`  | 生产模式（启用 minify） |
| `logLevel`   | "silent" \| "error" \| "warn" \| "info" \| "debug" | `"info"` | 日志级别 |

### 配置参数

| 参数               | 类型                                     | 默认值                        | 说明              |
| ------------------ | ---------------------------------------- | ----------------------------- | ----------------- |
| `entry`            | string \| string[] \| Record&lt;string, string&gt; | `[]`                  | 入口文件          |
| `alias`            | Record&lt;string, string&gt;             | `{}`                          | 路径别名          |
| `resolveExtensions`| string[]                                 | `[".js", ".jsx", ".ts", ".tsx"]` | 解析扩展名     |
| `outdir`           | string                                   | `"dist"`                      | 产物输出目录      |
| `charset`          | "utf8"                                   | `"utf8"`                      | 字符集            |
| `define`           | Record&lt;string, string \| number \| boolean&gt; | `{}`                  | 编译期常量注入    |
| `external`         | string[]                                 | `[]`                          | 外部模块          |
| `platform`         | "browser" \| "node" \| "neutral"         | `"browser"`                   | 运行平台          |
| `publicPath`       | string                                   | `"/"`                         | 资源公共路径      |
| `legalComments`    | "none" \| "inline" \| "eof" \| "linked" \| "external" | `"external"` | 法律注释模式 |
| `plugins`          | Plugin[]                                 | `[]`                          | 用户自定义插件    |

### JSX 参数

| 参数             | 类型                               | 默认值 | 说明              |
| ---------------- | ---------------------------------- | ------ | ----------------- |
| `jsx`            | "transform" \| "preserve" \| "automatic" | - | JSX 预设     |
| `jsxFactory`     | string                             | -      | JSX 工厂函数      |
| `jsxFragment`    | string                             | -      | JSX 片段函数      |
| `jsxImportSource`| string                             | -      | JSX 导入源路径    |

### Library 参数

| 参数            | 类型     | 默认值  | 说明                              |
| --------------- | -------- | ------- | --------------------------------- |
| `library`       | boolean  | `false` | 启用库打包模式，自动设置 globalName |
| `libraryName`   | string   | -       | 库全局名称（默认取 package.json name） |

### 参数优先级

`UserOpts 默认值 → CLI 默认值 → 用户配置文件 → CLI 参数`，后者覆盖前者。

## 内置行为

- **全局常量注入**：`define` 中的键在 browser 平台映射为 `import.meta.env.KEY`，在 node 平台映射为 `process.env.KEY`。同时自动注入 `PROD` / `DEV` 表示当前是否为生产模式。
- **生产模式**：`--production` 自动启用 `minify`。
- **内置插件**：自动加载 `esbuild-plugin-progress`（构建进度）和 `esbuild-sass-plugin`（Sass 编译）。
- **Library 模式**：从项目 `package.json` 自动读取包名作为 `globalName`。
