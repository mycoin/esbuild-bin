import esbuild from "esbuild";
import { Config, Opts } from "./interfaces";

export default async (opts: Config) => {
  return await esbuild.context(opts);
};
