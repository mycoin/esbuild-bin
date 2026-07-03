import esbuild from "esbuild";
import { Config, Opts } from "./interfaces";

export default async (opts: Opts, config: Config) => {
  const ctx = await esbuild.context(config);
  const run = async () => {
    if (opts.watch) {
      await ctx.watch({
        delay: 300,
      });
    } else {
      await ctx.rebuild();
      await ctx.dispose();
    }
  };
  await run();
};
