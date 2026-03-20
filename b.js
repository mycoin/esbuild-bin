const { parseArgs } = require("util");

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    port: { type: "string" },
    debug: { type: "boolean", default: true },
  },
  strict: true,
});

console.error(values);
