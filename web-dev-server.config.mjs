import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const commonjs = fromRollup(rollupCommonjs);

export default {
  appIndex: 'demo/index.html',
  open: true,
  nodeResolve: true,
  // esbuildTarget: "auto",
  plugins: [commonjs()]
};