declare const _default$1: (args: string[]) => Opts;
declare const _default$2: (opts: Opts, config: Config) => Promise<void>;
declare const _default: (opts: Opts) => Config;
type CliOpts = {
	outdir?: string;
	context?: string;
	sourcemap?: boolean | "linked" | "inline" | "external" | "both";
	watch?: boolean;
	server?: boolean;
	production?: boolean;
	logLevel?: LogLevel;
};
type Config = BuildOptions;
type Opts = CliOpts & UserOpts;
type Primitive = string | number | boolean;
type UserOpts = {
	entry?: string | string[] | Record<string, string>;
	alias?: Record<string, string>;
	resolveExtensions?: string[];
	outdir?: string;
	charset?: Charset;
	define?: Record<string, Primitive>;
	external?: string[];
	platform?: Platform;
	library?: boolean;
	libraryName?: string;
	libraryFormats?: Format[];
	jsx?: "transform" | "preserve" | "automatic";
	jsxFactory?: string;
	jsxFragment?: string;
	jsxImportSource?: string;
	publicPath?: string;
	plugins?: Plugin[];
	legalComments?: "none" | "inline" | "eof" | "linked" | "external";
};

export {
	_default as normalize,
	_default$1 as parseArgs,
	_default$2 as run,
};

export {};
