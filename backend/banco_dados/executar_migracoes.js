#!/usr/bin/env node
const { runFolder } = require('./run_folder');

(async () => {
  await runFolder('migracoes', process.argv);
})();
