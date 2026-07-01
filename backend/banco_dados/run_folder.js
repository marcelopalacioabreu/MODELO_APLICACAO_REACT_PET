const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function parseArgs(argv) {
  const opts = { dryRun: false, force: false, only: null, continueOnError: false, concurrency: 1 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--continue-on-error') opts.continueOnError = true;
    else if (a.startsWith('--only=')) opts.only = a.split('=')[1];
    else if (a.startsWith('--concurrency=')) opts.concurrency = parseInt(a.split('=')[1], 10) || 1;
  }
  return opts;
}

function listScripts(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.js'))
    .map(e => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function runScript(filePath, timeoutMs = 1000 * 60 * 5) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [filePath], { stdio: 'inherit' });
    let timedOut = false;
    const to = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(to);
      if (timedOut) return reject(new Error(`Timed out after ${timeoutMs}ms`));
      if (code === 0) return resolve();
      return reject(new Error(`Exit code ${code}`));
    });

    proc.on('error', (err) => {
      clearTimeout(to);
      reject(err);
    });
  });
}

async function runFolder(folderName, argv) {
  const opts = parseArgs(argv);
  const baseDir = path.join(__dirname, folderName);

  if (!fs.existsSync(baseDir)) {
    console.error(`[runner] Pasta não encontrada: ${baseDir}`);
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'development' && !opts.force) {
    console.error('[runner] Segurança: defina NODE_ENV=development ou passe --force para executar scripts.');
    process.exit(2);
  }

  let scripts = listScripts(baseDir)
    .filter(name => !name.startsWith('00_CANDIDATOS_A_EXCLUSAO'));

  // Exclude any scripts inside candidate folders (safety) and hidden files
  scripts = scripts.filter(n => !n.startsWith('.'));

  if (opts.only) {
    scripts = scripts.filter(n => n === opts.only || n === path.basename(opts.only));
  }

  if (scripts.length === 0) {
    console.log('[runner] Nenhum script encontrado para executar.');
    return;
  }

  console.log(`[runner] Encontrados ${scripts.length} scripts em ${folderName}`);
  for (const s of scripts) {
    const filePath = path.join(baseDir, s);
    if (opts.dryRun) {
      console.log(`[dry-run] ${filePath}`);
      continue;
    }

    console.log(`[runner] Executando ${s}...`);
    try {
      await runScript(filePath);
      console.log(`[runner] ${s} concluído com sucesso.`);
    } catch (err) {
      console.error(`[runner] Falha em ${s}:`, err.message || err);
      if (!opts.continueOnError) process.exit(1);
      console.warn('[runner] continue-on-error ativo: prosseguindo.');
    }
  }
}

module.exports = { runFolder };
