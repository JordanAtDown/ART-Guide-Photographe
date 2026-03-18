/**
 * migrate-to-eleventy.js
 * Extracts each div.module from index.html and writes Eleventy .njk source files.
 * Run: node scripts/migrate-to-eleventy.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

// Mapping: module id (without "mod-") → { title, permalink, outputPath }
const MODULE_MAP = {
  home: {
    title: 'ART — Guide du Photographe',
    permalink: '/',
    outputPath: 'src/index.njk'
  },
  pipeline: {
    title: 'Pipeline de traitement',
    permalink: '/modules/pipeline/',
    outputPath: 'src/modules/pipeline.njk'
  },
  exposition: {
    title: 'Exposition',
    permalink: '/modules/exposition/',
    outputPath: 'src/modules/exposition.njk'
  },
  egaliseurtonal: {
    title: 'Égaliseur Tonal',
    permalink: '/modules/egaliseurtonal/',
    outputPath: 'src/modules/egaliseurtonal.njk'
  },
  courbestonales: {
    title: 'Courbes Tonales',
    permalink: '/modules/courbestonales/',
    outputPath: 'src/modules/courbestonales.njk'
  },
  logtonemapping: {
    title: 'Log Tone Mapping',
    permalink: '/modules/logtonemapping/',
    outputPath: 'src/modules/logtonemapping.njk'
  },
  compressiondyn: {
    title: 'Compression Plage Dynamique',
    permalink: '/modules/compressiondyn/',
    outputPath: 'src/modules/compressiondyn.njk'
  },
  balanceblancs: {
    title: 'Balance des Blancs',
    permalink: '/modules/balanceblancs/',
    outputPath: 'src/modules/balanceblancs.njk'
  },
  saturation: {
    title: 'Saturation / Vibrance',
    permalink: '/modules/saturation/',
    outputPath: 'src/modules/saturation.njk'
  },
  eqcouleurs: {
    title: 'Égaliseur de Couleurs (HSL)',
    permalink: '/modules/eqcouleurs/',
    outputPath: 'src/modules/eqcouleurs.njk'
  },
  correctioncouleurs: {
    title: 'Correction Couleurs / Tonalité',
    permalink: '/modules/correctioncouleurs/',
    outputPath: 'src/modules/correctioncouleurs.njk'
  },
  colorwheels: {
    title: 'Guide Color Wheels',
    permalink: '/modules/colorwheels/',
    outputPath: 'src/modules/colorwheels.njk'
  },
  melange: {
    title: 'Mélange des Canaux',
    permalink: '/modules/melange/',
    outputPath: 'src/modules/melange.njk'
  },
  courbesrvb: {
    title: 'Courbes RVB',
    permalink: '/modules/courbesrvb/',
    outputPath: 'src/modules/courbesrvb.njk'
  },
  texture: {
    title: 'Amplification Texture',
    permalink: '/modules/texture/',
    outputPath: 'src/modules/texture.njk'
  },
  contrastelocal: {
    title: 'Contraste Local',
    permalink: '/modules/contrastelocal/',
    outputPath: 'src/modules/contrastelocal.njk'
  },
  lissage: {
    title: 'Lissage (Réduction de Bruit)',
    permalink: '/modules/lissage/',
    outputPath: 'src/modules/lissage.njk'
  },
  bruitimpulsion: {
    title: "Bruit d'Impulsion",
    permalink: '/modules/bruitimpulsion/',
    outputPath: 'src/modules/bruitimpulsion.njk'
  },
  lissagelocal: {
    title: 'Lissage — 8 Modes Détail',
    permalink: '/modules/lissagelocal/',
    outputPath: 'src/modules/lissagelocal.njk'
  },
  eliminationbrume: {
    title: 'Élimination de la Brume',
    permalink: '/modules/eliminationbrume/',
    outputPath: 'src/modules/eliminationbrume.njk'
  },
  looks: {
    title: '3 Looks Méditerranée',
    permalink: '/modules/looks/',
    outputPath: 'src/modules/looks.njk'
  },
  ordremodules: {
    title: 'Ordre des Modules',
    permalink: '/modules/ordremodules/',
    outputPath: 'src/modules/ordremodules.njk'
  }
};

// URL map for converting SPA onclick links to real hrefs
const URL_MAP = {};
for (const [id, meta] of Object.entries(MODULE_MAP)) {
  URL_MAP[`mod-${id}`] = meta.permalink;
}

function convertSpaLinks(html) {
  // Replace: href="#" onclick="show('mod-xxx')" or onclick="show('mod-xxx')" href="#"
  return html.replace(
    /href="#"\s+onclick="show\('(mod-[^']+)'\)"/g,
    (match, modId) => {
      const url = URL_MAP[modId] || '#';
      return `href="/ART-Guide-Photographe${url}"`;
    }
  ).replace(
    /onclick="show\('(mod-[^']+)'\)"\s+href="#"/g,
    (match, modId) => {
      const url = URL_MAP[modId] || '#';
      return `href="/ART-Guide-Photographe${url}"`;
    }
  );
}

function buildFrontMatter(title, permalink) {
  // Escape single quotes in title for YAML
  const safeTitle = title.replace(/'/g, "''");
  return `---\nlayout: base.njk\ntitle: '${safeTitle}'\npermalink: '${permalink}'\n---\n\n`;
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const indexPath = path.join(rootDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at', indexPath);
    process.exit(1);
  }

  console.log('Reading index.html...');
  const html = fs.readFileSync(indexPath, 'utf8');
  const root = parse(html);

  // Ensure src/modules exists
  const modulesDir = path.join(rootDir, 'src', 'modules');
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  for (const [shortId, meta] of Object.entries(MODULE_MAP)) {
    const fullId = `mod-${shortId}`;
    const el = root.querySelector(`#${fullId}`);

    if (!el) {
      console.warn(`  ⚠ Not found: #${fullId}`);
      skipped++;
      continue;
    }

    let innerHtml = el.innerHTML;

    // Convert SPA onclick links to real href links
    innerHtml = convertSpaLinks(innerHtml);

    // Trim leading/trailing whitespace
    innerHtml = innerHtml.trim();

    const frontMatter = buildFrontMatter(meta.title, meta.permalink);
    const fileContent = frontMatter + innerHtml + '\n';

    const outputPath = path.join(rootDir, meta.outputPath);
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`  ✓ Created: ${meta.outputPath}`);
    created++;
  }

  console.log(`\nDone: ${created} files created, ${skipped} skipped.`);
}

main();
