# esbuild-bin

一个基于 **esbuild** 的轻量级前端构建工具，专注于 **浏览器运行项目** 与 **npm 库构建** 两类核心场景。
目标是：**极少依赖、行为可预测、配置透明、性能优先**。

- 基于 esbuild，构建速度极快
- 支持 TS / TSX / JS / JSX / HTML 入口
- 内置常见前端技术支持（React / Solid / Vue / Svelte / Sass / Less 等，按需加载）
- 提供开发服务器与 HMR（自动刷新）
- 提供 library 模式，用于构建 npm 包
- 明确的参数优先级与冲突裁决规则
- 不引入隐式魔法，不篡改用户语义

## 1. 基本使用

安装命令

```bash
npm install -D esbuild-bin
```

全局可执行命令：

```bash
esbuild-bin

esbuild-bin dev
esbuild-bin build
```

### 1.1. Action 语义说明

`esbuild-bin` 提供两个 action：

| action  | 说明                                 |
| ------- | ------------------------------------ |
| `dev`   | 启动开发服务器，启用 HMR，默认不写盘 |
| `build` | 执行构建流程，默认压缩、写盘         |

**重要说明**：

- `action` 是**最高语义入口**
- 当 `action=build` 时：
  - 所有 devServer 相关参数都会被忽略
- 当未显式指定 `write` 且未启用 devServer 时：
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

## 1.3. 完整参数列表

**CLI / Config 通用参数**:

| 参数           | 类型                                                   | 必填 | 默认值                      | 说明                |
| -------------- | ------------------------------------------------------ | ---- | --------------------------- | ------------------- |
| `action`       | `'dev' \| 'build'`                                     | 否   | `'build'`                   | 构建动作            |
| `entry`        | `Record<string, string>`                               | 否   | `{ index: '@/index' }`      | 入口配置            |
| `production`   | `boolean`                                              | 否   | `action === 'build'`        | 是否生产模式        |
| `write`        | `boolean`                                              | 否   | `!devServer`                | 是否写入磁盘        |
| `outdir`       | `string`                                               | 否   | `'dist'`                    | 输出目录            |
| `publicPrefix` | `string`                                               | 否   | `'/'`                       | 资源公共路径前缀    |
| `vendorChunk`  | `string`                                               | 否   | `'vendor'`                  | 公共依赖 chunk 名称 |
| `target`       | `string \| string[]`                                   | 否   | `'modern'`                  | 语法目标            |
| `platform`     | `'browser'`                                            | 否   | `'browser'`                 | 运行平台            |
| `minify`       | `boolean \| 'whitespace' \| 'identifiers' \| 'syntax'` | 否   | `production ? true : false` | 压缩策略            |
| `sourcemap`    | `boolean \| 'inline' \| 'external'`                    | 否   | `production ? false : true` | Source Map          |
| `define`       | `Record<string, any>`                                  | 否   | `{}`                        | 编译期常量          |
| `loader`       | `Record<string, string>`                               | 否   | `{}`                        | esbuild loader 透传 |
| `plugins`      | `Plugin[]`                                             | 否   | `[]`                        | esbuild 插件        |
| `library`      | `boolean`                                              | 否   | `false`                     | 是否构建 npm 库     |

## 1.4. CSS 与资源处理

```ts
cssExtract: boolean;
```

- `true`：释放为独立样式文件
- `false`：内联到 JS

**静态资源**:

```ts
dataUriLimit: number; // 默认 4096
```

- 小于该值：转为 base64
- 大于该值：复制到输出目录

**public 目录复制**:

```ts
copyPublicDir: boolean; // 默认 true
```

- 若存在 `public/` 目录，自动复制到输出目录
- 可显式关闭

## 1.5. 开发服务器

**server 配置**:

| 参数         | 类型                           | 默认值      |
| ------------ | ------------------------------ | ----------- |
| `hostname`   | `string`                       | `127.0.0.1` |
| `port`       | `number`                       | 自动分配    |
| `hmr`        | `boolean`                      | `true`      |
| `proxy`      | `Record<string, ProxyOptions>` | `{}`        |
| `middleware` | `(req, res, next) => void`     | 可选        |

**端口策略**:

- 若用户显式指定 `port` 且被占用 → 报错
- 若使用默认端口 → 自动递增寻找可用端口

**构建错误处理**:

- 构建失败时，浏览器全屏展示错误信息
- 错误修复后自动恢复

## 1.6. JSX 处理规则

**默认行为**:

- 自动读取 `tsconfig.json` 中的：

  - `jsx`
  - `jsxFactory`
  - `jsxFragmentFactory`
  - `jsxImportSource`

**CLI 覆盖**:

```bash
--jsx=react | solid | vue
```

- CLI 优先级高于 tsconfig

## 1.7. 内置编译期常量（不可覆盖）

构建时强制注入以下常量：

| 常量       | 类型                            | 说明                 |
| ---------- | ------------------------------- | -------------------- |
| `MODE`     | `'development' \| 'production'` | 构建模式             |
| `VERSION`  | `string`                        | package.json version |
| `BUILD_TS` | `number`                        | 构建时间戳（毫秒）   |

**注意**: 用户通过 `define` 传入同名字段将被覆盖!

---

## 1.8. Library 模式（npm 包构建规范）

当启用 `--library` 时，工具进入 **npm 包构建模式**，并遵循以下强约束：

1. **禁止多入口**

   - 仅允许单 entry

2. **严格遵循 package.json**

   - 不擅自决定输出格式

3. **产物结构必须与声明一致**
   - 否则直接报错

**package.json 推荐写法**:

同时支持 ESM / CJS

```json
{
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "typings/index.d.ts"
}
```

或使用 exports：

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "types": "typings/index.d.ts"
}
```

**构建行为说明**:

- 存在 `module` → 生成 ESM
- 存在 `main` → 生成 CJS
- 未声明的格式 **不会生成**
- 路径不一致 → 构建失败

**TypeScript 类型声明**:

library 模式下：

- 使用 `tsc --emitDeclarationOnly`
- 输出到 `typings/`
- 不进行声明文件合并
- 推荐在 package.json 中声明：

```json
"types": "typings/index.d.ts"
```

## 2. 设计原则

- 明确优于魔法
- 用户配置永远可预测
- 不隐式修改 package.json 语义
- 不强制用户安装未使用依赖
- 所有 esbuild 能力均可透传

## 3. 示例

**Web 项目构建** :

```bash
esbuild-bin build --public-prefix=/assets/
```

**开发模式** :

```bash
esbuild-bin dev --port=3000
```

**构建 npm 库**:

```bash
esbuild-bin build --library
```

## 4. License

MIT
