const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const target = path.join(__dirname, '..', 'index.html');

console.log('👁  Surveillance de index.html...');
console.log('    art-knowledge.json sera mis à jour à chaque sauvegarde.\n');

chokidar.watch(target).on('change', () => {
  const ts = new Date().toLocaleTimeString();
  console.log(`[${ts}] Modification détectée → extraction...`);
  try {
    execSync('node scripts/extract-knowledge.js', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('❌ Erreur extraction :', e.message);
  }
});
