#!/usr/bin/env node

const esbuild = require("esbuild");
const pkg = require("./package.json");

const run = async (watch, esm) => {
  const ctx = await esbuild.context({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "esnext",
    minify: false,
    format: esm ? "esm" : "cjs",
    outfile: esm ? pkg.module : pkg.main,
    logLevel: esm ? "silent" : "error",
    plugins: [
      {
        name: "log",
        setup: (build) => {
          if (esm) {
            return;
          }
          build.onEnd((result) => {
            if (!result.errors.length) {
              console.log("✅ compiled.");
            }
          });
        },
      },
    ],
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

  await run(watch, false);
  await run(watch, true);

  if (watch) {
    console.log("Watching...");
  } else {
    console.log("DONE");
  }
})();
