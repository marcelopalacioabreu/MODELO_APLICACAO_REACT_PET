#!/usr/bin/env node
const { runFolder } = require('./run_folder');

(async () => {
  await runFolder('auxiliares', process.argv);
})();
