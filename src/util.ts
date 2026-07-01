import {
  parseArgs,
  ParseArgsOptionDescriptor,
  ParseArgsOptionsConfig,
} from "util";

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

export const parseArgv = <T>(args: string[], defaults: T): T => {
  const optionsConfig = getOptionsConfig(defaults);
  const results = {} as T;
  const { values } = parseArgs({
    args,
    allowNegative: true,
    allowPositionals: true,
    options: {
      ...optionsConfig,
    },
  });
  for (const key in values) {
    if (typeof defaults[key] === "number") {
      results[key] = Number(values[key]);
    } else {
      results[key] = values[key];
    }
  }
  return results;
};
