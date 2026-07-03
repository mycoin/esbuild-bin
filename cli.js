#!/usr/bin/env node

const { normalize, parseArgs, run } = require(".");

const start = async () => {
  const opts = parseArgs(process.argv.slice(2));
  const config = normalize(opts);

  await run(opts, config);
};

process.on("SIGINT", () => {
  process.exit(0);
});

start();
