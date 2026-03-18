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

function extractModule(moduleEl) {
  const id = moduleEl.getAttribute('id');
  if (!id) return null;

  const name = stripHtml(
    moduleEl.querySelector('h2')?.innerHTML || ''
  );
  const subtitle = stripHtml(
    moduleEl.querySelector('.subtitle')?.innerHTML || ''
  );
  const category = stripHtml(
    moduleEl.querySelector('.module-tag span')?.innerHTML || ''
  );

  const params = moduleEl.querySelectorAll('.param-item').map(p => ({
    name: stripHtml(p.querySelector('.param-name')?.innerHTML || ''),
    range: stripHtml(p.querySelector('.param-range')?.innerHTML || ''),
    description: stripHtml(p.querySelector('.param-desc')?.innerHTML || '')
  })).filter(p => p.name);

  const tips = moduleEl.querySelectorAll('.tip').map(t => ({
    label: stripHtml(t.querySelector('.tip-label')?.innerHTML || ''),
    content: stripHtml(t.querySelector('p')?.innerHTML || '')
  })).filter(t => t.label);

  const warnings = moduleEl.querySelectorAll('.warning p')
    .map(w => stripHtml(w.innerHTML))
    .filter(Boolean);

  const tables = extractTables(moduleEl);

  return {
    id,
    name,
    subtitle,
    category,
    params,
    tips,
    warnings,
    tables
  };
}

function main() {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const outPath = path.join(__dirname, '..', 'art-knowledge.json');

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const root = parse(html);

  const modules = root
    .querySelectorAll('.module')
    .map(extractModule)
    .filter(Boolean)
    .filter(m => m.name && m.id !== 'mod-home');

  const knowledge = {
    meta: {
      source: 'ART Raw Image Processor — Documentation Photographe',
      version: '1.0',
      generated: new Date().toISOString(),
      total_modules: modules.length,
      description: 'Knowledge base extractée de la documentation ART ' +
        'pour usage par MCP ou tout système de génération de fichiers .arp'
    },
    modules
  };

  fs.writeFileSync(outPath, JSON.stringify(knowledge, null, 2), 'utf-8');
  console.log(
    `✅ art-knowledge.json généré — ${modules.length} modules extraits`
  );
}

main();
