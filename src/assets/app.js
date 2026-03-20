function filterNav(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('nav a').forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
  document.querySelectorAll('.nav-section').forEach(s => {
    s.style.display = q ? 'none' : 'block';
  });
}

function toggleNav() {
  document.querySelector('nav').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
}

function closeNav() {
  document.querySelector('nav').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}

document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', closeNav));

// ─── Bouton retour en haut ───
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (btn) btn.addEventListener('click', scrollToTop);

  // ─── Liens retour en haut sur les titres de section ───
  document.querySelectorAll('h3.section-title').forEach(h => {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'section-top-link';
    a.setAttribute('aria-label', 'Retour en haut');
    a.textContent = '↑';
    a.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    h.appendChild(a);
  });
});

// ─── Lexique — Données ───
const LEXIQUE_DATA = {
  'RAW': { short: 'Format de fichier brut du capteur photo.', cat: 'general' },
  'Fichier .arp': { short: 'Fichier de paramètres ART — tous les réglages sans toucher au RAW.', cat: 'general' },
  'Pipeline de traitement': { short: 'Ordre interne fixe dans lequel ART applique chaque module.', cat: 'general' },
  'Dématriçage': { short: 'Conversion des données brutes du capteur en image RVB exploitable.', cat: 'general' },
  'EV': { short: 'Exposure Value — chaque +1 EV double la luminosité.', cat: 'general' },
  'Stop': { short: 'Synonyme de EV — doublement ou division par deux de la lumière.', cat: 'general' },
  'Histogramme': { short: 'Graphique représentant la distribution des luminosités dans une image.', cat: 'general' },
  'LUT': { short: 'Look-Up Table — table de correspondance couleur appliquant un look prédéfini.', cat: 'general' },
  'Non-destructif': { short: 'Mode de traitement qui ne modifie jamais le fichier original.', cat: 'general' },
  'Plage dynamique': { short: 'Écart entre la zone la plus sombre et la plus lumineuse qu\'un capteur peut enregistrer simultanément.', cat: 'expo' },
  'Log Tone Mapping': { short: 'Module central d\'ART pour la gestion HDR de la plage dynamique.', cat: 'expo' },
  'Hautes Lumières': { short: 'Zones lumineuses d\'une image — ciels, reflets, surfaces blanches.', cat: 'expo' },
  'Clip': { short: 'Zone où l\'exposition dépasse la capacité du capteur — toute information est perdue.', cat: 'expo' },
  'Point Gris': { short: 'Référence de luminosité standard à 18% — niveau des tons moyens.', cat: 'expo' },
  'Courbe en S': { short: 'Courbe tonale classique qui ajoute du contraste.', cat: 'expo' },
  'Dodge & Burn': { short: 'Technique pour éclaircir (dodge) ou assombrir (burn) des zones précises.', cat: 'expo' },
  'Compression dynamique': { short: 'Réduction locale des écarts de luminosité pour révéler les détails.', cat: 'expo' },
  'Balance des Blancs': { short: 'Correction de la dominante colorée due à la source lumineuse.', cat: 'couleur' },
  'Kelvin': { short: 'Unité de mesure de la température de couleur d\'une source lumineuse.', cat: 'couleur' },
  'HSL': { short: 'Teinte / Saturation / Luminance — modifier chaque couleur indépendamment.', cat: 'couleur' },
  'Saturation': { short: 'Intensité ou pureté d\'une couleur — de neutre (0) à couleur pure maximale.', cat: 'couleur' },
  'Vibrance': { short: 'Saturation intelligente — booste les couleurs ternes en protégeant les couleurs vives.', cat: 'couleur' },
  'Color Grading': { short: 'Attribution de couleurs différentes aux ombres, tons moyens et hautes lumières.', cat: 'couleur' },
  'Color Wheels': { short: 'Roues chromatiques pour teinter ombres, tons moyens et hautes lumières indépendamment.', cat: 'couleur' },
  'RVB': { short: 'Rouge Vert Bleu — espace colorimétrique additif de base des écrans.', cat: 'couleur' },
  'Split Toning': { short: 'Teinte froide dans les ombres, teinte chaude dans les hautes lumières.', cat: 'couleur' },
  'Dominante': { short: 'Axe vert/magenta de la balance des blancs — corrige les dominantes résiduelles.', cat: 'couleur' },
  'Espace Lab': { short: 'Espace colorimétrique qui sépare la luminosité (L) de la couleur (a, b).', cat: 'couleur' },
  'Bruit numérique': { short: 'Variation aléatoire de luminosité ou de couleur — analogue au grain argentique.', cat: 'detail' },
  'Bruit de luminance': { short: 'Variation de luminosité pixel à pixel — ressemble au grain argentique.', cat: 'detail' },
  'Bruit de chrominance': { short: 'Taches de couleur parasites — toujours disgracieux, à traiter agressivement.', cat: 'detail' },
  'Débruitage': { short: 'Algorithme de réduction du bruit numérique dans une image.', cat: 'detail' },
  'ISO': { short: 'Sensibilité du capteur — une valeur élevée amplifie le signal mais aussi le bruit.', cat: 'detail' },
  'Contraste local': { short: 'Renforcement du contraste à l\'échelle des détails et textures.', cat: 'detail' },
  'Amplification de texture': { short: 'Module ART qui révèle les micro-détails sans amplifier le bruit.', cat: 'detail' },
  'Halo': { short: 'Artefact visuel — auréole claire autour des contrastes forts.', cat: 'detail' },
  'Piqué': { short: 'Netteté et précision des détails fins — qualité optique et numérique combinées.', cat: 'detail' },
};

// ─── Liens Modules ART ───
const MODULE_LINKS = {
  'Log Tone Mapping':              '/ART-Guide-Photographe/modules/logtonemapping/',
  'Égaliseur Tonal':               '/ART-Guide-Photographe/modules/egaliseurtonal/',
  'Courbes Tonales':               '/ART-Guide-Photographe/modules/courbestonales/',
  'Compression de Plage Dynamique':'/ART-Guide-Photographe/modules/compressiondyn/',
  'Compression Dynamique':         '/ART-Guide-Photographe/modules/compressiondyn/',
  'Balance des Blancs':            '/ART-Guide-Photographe/modules/balanceblancs/',
  'Égaliseur de Couleurs':         '/ART-Guide-Photographe/modules/eqcouleurs/',
  'Color Wheels':                  '/ART-Guide-Photographe/modules/correctioncouleurs/',
  'Correction Couleurs':           '/ART-Guide-Photographe/modules/correctioncouleurs/',
  'Mélange des Canaux':            '/ART-Guide-Photographe/modules/melange/',
  'Courbes RVB':                   '/ART-Guide-Photographe/modules/courbesrvb/',
  'Amplification de Texture':      '/ART-Guide-Photographe/modules/texture/',
  'Amplification Texture':         '/ART-Guide-Photographe/modules/texture/',
  'Contraste Local':               '/ART-Guide-Photographe/modules/contrastelocal/',
  'Lissage Local':                 '/ART-Guide-Photographe/modules/lissagelocal/',
  "Bruit d'Impulsion":             '/ART-Guide-Photographe/modules/bruitimpulsion/',
  'Élimination de la Brume':       '/ART-Guide-Photographe/modules/eliminationbrume/',
};

function initModuleLinks() {
  const currentPath = window.location.pathname;
  const main = document.querySelector('main');
  if (!main) return;

  const terms = Object.keys(MODULE_LINKS).sort((a, b) => b.length - a.length);

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const tag = n.parentElement.tagName;
      if (['CODE', 'SCRIPT', 'STYLE', 'A', 'BUTTON', 'INPUT'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (n.parentElement.closest('h2, .lex-card, script')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    let html = node.textContent;
    let changed = false;
    terms.forEach(term => {
      const url = MODULE_LINKS[term];
      // Ne pas lier si on est déjà sur cette page
      if (currentPath.endsWith(url.replace('/ART-Guide-Photographe', ''))) return;
      if (!html.includes(term)) return;
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<![\\wÀ-öø-ÿ])${escaped}(?![\\wÀ-öø-ÿ])`, 'g');
      const newHtml = html.replace(re, `<a class="module-link" href="${url}">${term}</a>`);
      if (newHtml !== html) { html = newHtml; changed = true; }
    });
    if (changed) {
      const span = document.createElement('span');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    }
  });
}

// ─── Lexique — Tooltips au clic ───
function initLexiqueTooltips() {
  const tooltip = document.getElementById('lexiqueTooltip');
  if (!tooltip) return;

  const main = document.querySelector('main');
  if (!main) return;

  // Trier les termes par longueur décroissante (traiter les termes composés en premier)
  const terms = Object.keys(LEXIQUE_DATA).sort((a, b) => b.length - a.length);

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const tag = n.parentElement.tagName;
      if (['CODE', 'SCRIPT', 'STYLE', 'A', 'BUTTON', 'INPUT'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (n.parentElement.closest('h2, .lexique-term, .lex-card, script')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    let html = node.textContent;
    let changed = false;
    terms.forEach(term => {
      if (!html.includes(term)) return;
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<![\\wÀ-öø-ÿ])${escaped}(?![\\wÀ-öø-ÿ])`, 'g');
      const newHtml = html.replace(re, `<span class="lexique-term" data-term="${term}">${term}</span>`);
      if (newHtml !== html) { html = newHtml; changed = true; }
    });
    if (changed) {
      const span = document.createElement('span');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    }
  });

  // Événements tooltip — clic pour ouvrir/fermer
  let activeTermEl = null;

  function termSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  document.addEventListener('click', e => {
    const term = e.target.closest('.lexique-term');
    if (term) {
      e.stopPropagation();
      if (activeTermEl === term && tooltip.classList.contains('visible')) {
        tooltip.classList.remove('visible');
        activeTermEl = null;
        return;
      }
      const data = LEXIQUE_DATA[term.dataset.term];
      if (!data) return;
      activeTermEl = term;
      tooltip.querySelector('.ltt-name').textContent = term.dataset.term;
      tooltip.querySelector('.ltt-short').textContent = data.short;
      tooltip.querySelector('.ltt-link').href = '/ART-Guide-Photographe/modules/lexique/#lex-' + termSlug(term.dataset.term);

      // Positionnement sous le terme cliqué
      const rect = term.getBoundingClientRect();
      const x = Math.min(rect.left, window.innerWidth - 295);
      const y = Math.min(rect.bottom + 8, window.innerHeight - 130);
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      tooltip.classList.add('visible');
    } else if (!e.target.closest('#lexiqueTooltip')) {
      tooltip.classList.remove('visible');
      activeTermEl = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initModuleLinks();
  initLexiqueTooltips();
});
