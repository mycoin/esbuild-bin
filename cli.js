#!/usr/bin/env node

const { normalize, defineConfig, run } = require(".");

process.on("uncaughtException", (error) => {
  console.error(error.message);
});

process.on("SIGINT", () => {
  process.exit(0);
});

const opts = normalize({});
const config = defineConfig(opts);

run(config, opts);
