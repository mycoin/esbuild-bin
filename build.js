#!/usr/bin/env node

const esbuild = require("esbuild");
const progressPlugin = require("esbuild-plugin-progress");
const pkg = require("./package.json");

const run = async (watch, format) => {
  const quiet = format === "esm";
  const ctx = await esbuild.context({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    platform: "node",
    target: "esnext",
    minify: !watch,
    format,
    outfile: format === "esm" ? pkg.module : pkg.main,
    logLevel: quiet ? "silent" : "error",
    // 不打包 esbuild
    packages: "external",
    plugins: quiet ? [] : [progressPlugin()],
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
};

(async () => {
  const watch = process.argv[2] === "watch";

  await run(watch, "esm");
  await run(watch, "cjs");
})();
