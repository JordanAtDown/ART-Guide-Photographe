const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<strong>/gi, '**').replace(/<\/strong>/gi, '**')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTables(moduleEl) {
  return moduleEl.querySelectorAll('table').map(table => {
    const headers = table.querySelectorAll('th').map(th =>
      stripHtml(th.innerHTML)
    );
    const rows = table.querySelectorAll('tr')
      .filter(tr => tr.querySelectorAll('td').length > 0)
      .map(tr =>
        tr.querySelectorAll('td').map(td => stripHtml(td.innerHTML))
      );
    return { headers, rows };
  });
}

function stripFrontMatter(content) {
  // Remove YAML front matter between --- delimiters
  return content.replace(/^---[\s\S]*?---\n/, '');
}

function extractFromFile(filePath, id) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const html = stripFrontMatter(raw);
  const root = parse(html);

  const name = stripHtml(root.querySelector('h2')?.innerHTML || '');
  const subtitle = stripHtml(root.querySelector('.subtitle')?.innerHTML || '');
  const category = stripHtml(root.querySelector('.module-tag span')?.innerHTML || '');

  const params = root.querySelectorAll('.param-item').map(p => ({
    name: stripHtml(p.querySelector('.param-name')?.innerHTML || ''),
    range: stripHtml(p.querySelector('.param-range')?.innerHTML || ''),
    description: stripHtml(p.querySelector('.param-desc')?.innerHTML || '')
  })).filter(p => p.name);

  const tips = root.querySelectorAll('.tip').map(t => ({
    label: stripHtml(t.querySelector('.tip-label')?.innerHTML || ''),
    content: stripHtml(t.querySelector('p')?.innerHTML || '')
  })).filter(t => t.label);

  const warnings = root.querySelectorAll('.warning p')
    .map(w => stripHtml(w.innerHTML))
    .filter(Boolean);

  const tables = extractTables(root);

  return { id, name, subtitle, category, params, tips, warnings, tables };
}

function main() {
  const rootDir = path.join(__dirname, '..');
  const modulesDir = path.join(rootDir, 'src', 'modules');
  const outPath = path.join(rootDir, 'art-knowledge.json');

  const moduleFiles = fs.readdirSync(modulesDir)
    .filter(f => f.endsWith('.njk'))
    .sort();

  const modules = moduleFiles.map(file => {
    const id = 'mod-' + path.basename(file, '.njk');
    return extractFromFile(path.join(modulesDir, file), id);
  }).filter(m => m.name);

  const knowledge = {
    meta: {
      source: 'ART Raw Image Processor — Documentation Photographe',
      version: '1.0',
      generated: new Date().toISOString(),
      total_modules: modules.length,
      description: 'Knowledge base extraite des sources Eleventy ' +
        'pour usage par MCP ou tout système de génération de fichiers .arp'
    },
    modules
  };

  fs.writeFileSync(outPath, JSON.stringify(knowledge, null, 2), 'utf-8');
  console.log(`✅ art-knowledge.json généré — ${modules.length} modules extraits`);
}

main();
