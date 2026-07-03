import { cosmiconfigSync } from "cosmiconfig";
import {
  parseArgs as parse,
  ParseArgsOptionDescriptor,
  ParseArgsOptionsConfig,
} from "util";

// 加载用户配置
export const lookupConfig = () => {
  const explorer = cosmiconfigSync("build", {
    searchPlaces: [
      "build.config.ts",
      "build.config.js",
      "build.config.cjs",
      "build.config.json",
      "package.json",
    ],
  });
  const result = explorer.search();
  if (result && result.config) {
    return result.config;
  } else {
    return null;
  }
};

const typeofValue = (val: unknown): "string" | "boolean" => {
  if (typeof val === "string" || typeof val === "number") {
    return "string";
  } else if (typeof val === "boolean") {
    return "boolean";
  }
  return null;
};

const getOptionsConfig = <T>(defaults: T) => {
  const optionsConfig: ParseArgsOptionsConfig = {};

  for (const key in defaults) {
    const val = defaults[key];
    const item: ParseArgsOptionDescriptor = {
      type: typeofValue(val),
    };
    if (Array.isArray(val)) {
      item.multiple = true;
      item.type = typeofValue(val[0]);
    }
    if (item.type) {
      optionsConfig[key] = item;
    }
  }
  return optionsConfig;
};

export const toLibraryName = (name: string) =>
  name
    .replace(/^@[^/]+\//, "")
    .split(/[-_]/)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

export const parseArgs = <T>(args: string[], defaults: T): Partial<T> => {
  const options = getOptionsConfig(defaults);
  const results: Record<string, unknown> = {};
  const { values } = parse({
    args,
    allowNegative: true,
    allowPositionals: true,
    options: {
      ...options,
    },
  });

  for (const k in values) {
    if (typeof defaults[k] === "number") {
      results[k] = Number(values[k]);
    } else if (typeof defaults[k] !== "undefined") {
      results[k] = values[k];
    }
  }
  return results as Partial<T>;
};
