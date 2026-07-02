#!/usr/bin/env node

const { buildContext, normalize, parseArgs, run } = require(".");

process.on("uncaughtException", (error) => {
  console.error(error.message);
});

process.on("SIGINT", () => {
  process.exit(0);
});

const start = async () => {
  const opts = parseArgs(process.argv.slice(2));
  // const config = normalize(opts);

  console.error(opts);

  // const ctx = await buildContext(config);

  // await ctx.rebuild();
  // await ctx.watch({
  //   delay: 300,
  // });
};

start();
