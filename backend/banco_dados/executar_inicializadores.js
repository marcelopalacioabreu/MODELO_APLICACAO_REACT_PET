#!/usr/bin/env node
const path = require('path');
const { runFolder } = require('./run_folder');

(async () => {
  await runFolder('inicializadores', process.argv);
})();
