#!/usr/bin/env node

const { defineConfig, normalize, parseArgs, run } = require(".");
const argv = parseArgs(process.argv.slice(2));

process.on("uncaughtException", (error) => {
  console.error(error.message);
});

process.on("SIGINT", () => {
  process.exit(0);
});

const opts = normalize(argv);
const config = defineConfig(opts);

run(config, opts);
