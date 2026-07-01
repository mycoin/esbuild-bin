import esbuild from "esbuild";
import { Config } from "./interfaces";

export default async (opts: Config) => {
  const buildCxt = await esbuild.context(opts);
  await buildCxt.rebuild();
};
