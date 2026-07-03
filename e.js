import fs from "fs-extra";
import { generateDtsBundle } from "dts-bundle-generator";

const bundles = generateDtsBundle([
  {
    filePath: "./src/index.ts",
    project: "./tsconfig.json",
    noCheck: true,
    output: {
      noBanner: true,
      sortNodes: true,
      exportReferencedTypes: false,
    },
    libraries: {
      inlinedLibraries: [],
      importedLibraries: [],
    },
  },
]);

await fs.outputFile("./index.d.ts", bundles[0], "utf8");
