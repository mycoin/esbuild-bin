# esbuild-bin

一个基于 **esbuild** 的轻量级前端构建工具，专注于 **浏览器运行项目** 与 **npm 库构建** 两类核心场景。
目标是：**极少依赖、行为可预测、配置透明、性能优先**。

- 基于 esbuild，构建速度极快
- 支持 TS / TSX / JS / JSX / HTML 入口
- 通过 loader / plugin **适配**常见前端技术（React / Solid / Vue / Svelte / Sass / Less 等）
- 提供开发服务器与 HMR（自动刷新）
- 提供 library 模式，用于构建 npm 包
- 明确的参数优先级与冲突裁决规则
- **内置危险参数安全校验，避免破坏性操作**
- 不引入隐式魔法，不篡改用户语义

**重要说明**

> esbuild-bin **不内置、不打包、不私藏任何框架或预处理器实现**。
> 是否可用，完全取决于用户项目中是否显式安装对应依赖。

## 1. 基本使用

### 安装

```bash
npm install -D esbuild-bin
```

### 命令行

```bash
esbuild-bin
esbuild-bin dev
esbuild-bin build
```

## 1.1. Action 语义说明

`esbuild-bin` 提供两个 action：

| action  | 说明                                 |
| ------- | ------------------------------------ |
| `dev`   | 启动开发服务器，启用 HMR，默认不写盘 |
| `build` | 执行构建流程，默认压缩、写盘         |

### 重要语义规则

- `action` 是**最高语义入口**
- 当 `action=build` 时：

  - 所有 `devServer` / `server` 相关参数都会被忽略

- 当 **未启用 devServer 且未显式关闭 `write`** 时：

  - 将强制开启 `write=true`

## 1.2. 配置文件

支持 `build.config.js` / `build.config.ts`，**仅导出普通对象**：

```ts
export default {
  entry: {
    index: "@/index.tsx",
  },
};
```

不提供 `defineConfig` 包装，避免多余抽象与语义隐藏。

## 1.3. 完整参数列表

### CLI / Config 通用参数

| 参数           | 类型                                                   | 必填 | 默认值                      | 说明                     |
| -------------- | ------------------------------------------------------ | ---- | --------------------------- | ------------------------ |
| `action`       | `'dev' \| 'build'`                                     | 否   | `'build'`                   | 构建动作                 |
| `entry`        | `Record<string, string>`                               | 否   | `{ index: '@/index' }`      | 入口配置                 |
| `production`   | `boolean`                                              | 否   | `action === 'build'`        | 是否生产模式             |
| `write`        | `boolean`                                              | 否   | `!devServer`                | 是否写入磁盘             |
| `clean`        | `boolean`                                              | 否   | `true`                      | 构建前是否清空 outdir    |
| `outdir`       | `string`                                               | 否   | `'dist'`                    | 输出目录                 |
| `publicPrefix` | `string`                                               | 否   | `'/'`                       | 资源公共路径前缀         |
| `vendorChunk`  | `string`                                               | 否   | `'vendor'`                  | 公共依赖 chunk 名称      |
| `platform`     | `'browser'`                                            | 否   | `'browser'`                 | 运行平台                 |
| `target`       | `string \| string[]`                                   | 否   | `'modern'`                  | 语法转译目标             |
| `minify`       | `boolean \| 'whitespace' \| 'identifiers' \| 'syntax'` | 否   | `production ? true : false` | 压缩策略                 |
| `sourcemap`    | `boolean \| 'inline' \| 'external'`                    | 否   | `production ? false : true` | Source Map               |
| `define`       | `Record<string, any>`                                  | 否   | `{}`                        | 编译期常量               |
| `loader`       | `Record<string, string>`                               | 否   | `{}`                        | esbuild loader 透传      |
| `plugins`      | `Plugin[]`                                             | 否   | `[]`                        | esbuild 插件（用户优先） |
| `library`      | `boolean`                                              | 否   | `false`                     | 是否构建 npm 库          |
| `logLevel`     | `'silent' \| 'error' \| 'warn' \| 'info' \| 'debug'`   | 否   | `'info'`                    | 日志级别                 |
| `analyze`      | `boolean \| 'json'`                                    | 否   | `false`                     | 构建分析输出             |

## 1.3.1. outdir 安全校验（**强制规则**）

为了防止误删用户源码或系统文件，`esbuild-bin` 在 **可能触发写盘与清理行为** 时，会对 `outdir` 执行**强制安全校验**。

### 触发条件

仅在以下条件同时满足时生效：

```ts
write === true && clean !== false;
```

### 明确禁止的 outdir 配置

以下配置 **将直接报错并终止构建**：

- 根目录或当前目录：

  - `/`
  - `./`
  - `.`
  - 空字符串

- 项目根目录本身（`process.cwd()`）
- 指向项目源码目录的路径（如 `src/`）

### 设计原则

- **不尝试修正**
- **不自动兜底**
- **不降级为 warning**
- 一旦命中危险路径，立即中断构建

> 该规则属于 **安全裁决（Safety Rule）**，
> 优先级高于用户配置，且不可被覆盖。

## 1.4. CSS 与资源处理

### CSS

```ts
cssExtract: boolean;
```

- `true`：释放为独立样式文件
- `false`：样式内联到 JS

> dev 模式通常建议内联，build 模式建议释放文件。

### 静态资源

```ts
dataUriLimit: number; // 默认 4096
```

- 小于该值：转为 base64 Data URI
- 大于该值：复制到输出目录

### public 目录复制

```ts
copyPublicDir: boolean; // 默认 true
```

- 若存在 `public/` 目录，则复制到输出目录
- 可显式关闭

## 1.5. 开发服务器（仅 dev 生效）

### server 配置

| 参数         | 类型                           | 默认值      |
| ------------ | ------------------------------ | ----------- |
| `hostname`   | `string`                       | `127.0.0.1` |
| `port`       | `number`                       | 自动分配    |
| `hmr`        | `boolean`                      | `true`      |
| `proxy`      | `Record<string, ProxyOptions>` | `{}`        |
| `middleware` | `(req, res, next) => void`     | 可选        |

### 端口策略

- 显式指定端口且被占用 → **直接报错**
- 未指定端口 → 自动递增寻找可用端口

## 1.6. JSX 处理规则

```ts
jsx: "auto" | "preserve" | "react" | "react-jsx" | "solid" | "vue";
```

### 行为规则

- **显式配置优先**
- 未配置时：

  - 自动读取 `tsconfig.json` 中的：

    - `jsx`
    - `jsxFactory`
    - `jsxFragmentFactory`
    - `jsxImportSource`

## 1.7. 内置编译期常量（不可覆盖）

| 常量       | 类型                            | 说明                 |
| ---------- | ------------------------------- | -------------------- |
| `MODE`     | `'development' \| 'production'` | 构建模式             |
| `VERSION`  | `string`                        | package.json version |
| `BUILD_TS` | `number`                        | 构建时间戳（毫秒）   |

> 用户通过 `define` 传入同名字段将被忽略。

## 1.8. Library 模式（npm 包构建规范）

启用 `--library` 后，工具进入 **npm 包构建模式**，并遵循以下强约束：

### 强约束规则

1. **禁止多入口**
2. **自动禁用压缩**
3. **强制关闭 sourcemap**
4. **严格遵循 package.json 声明**

### 构建行为补充

- `minify` → 强制 `false`
- `sourcemap` → 强制 `false`

### TypeScript 声明

- 使用 `tsc --emitDeclarationOnly`
- 输出到 `typings/`
- 不做类型检查
- 不做声明合并

## 2. 设计原则

- 明确优于魔法
- 用户配置必须可预测
- **安全优先于灵活**
- 只做适配，不做实现
- esbuild 能力完全透传
- 构建 ≠ 类型检查

## 3. 示例

### Web 项目构建

```bash
esbuild-bin build --public-prefix=/assets/
```

### 开发模式

```bash
esbuild-bin dev --port=3000
```

### 构建 npm 库

```bash
esbuild-bin build --library
```

## 4. License

MIT
