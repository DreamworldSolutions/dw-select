import rollupCommonjs from "@rollup/plugin-commonjs";
import { fromRollup } from "@web/dev-server-rollup";

const commonjs = fromRollup(rollupCommonjs);

export default {
  appIndex: "demo/index.html",
  open: true,
  nodeResolve: true,
  port: 8005,
  // esbuildTarget: "auto",
  plugins: [commonjs()],
};
