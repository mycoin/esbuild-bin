#!/usr/bin/env node

import { normalize, parseArgs, run } from "./dist/index.js";

process.on("SIGINT", () => {
  process.exit(0);
});

const opts = parseArgs(process.argv.slice(2));
const config = normalize(opts);

await run(opts, config);
