# CLAUDE.md — ART Guide Photographe

## Présentation du projet

Documentation du logiciel **ART** (Another RawTherapee, dérivé de RawTherapee), destinée aux photographes. Le workflow couvert est **RAW → TIFF → Affinity Photo**.

URL de production : `https://jordanatdown.github.io/ART-Guide-Photographe/`

---

## Architecture — Eleventy (11ty)

Le projet utilise **Eleventy v3** (SSG) avec **Nunjucks** pour générer un site statique multi-pages depuis `src/`.

```
ART-guide-photographe/
├── src/
│   ├── _layouts/
│   │   └── base.njk          ← shell HTML (head, nav, footer)
│   ├── _includes/
│   │   └── nav.njk           ← sidebar navigation partagée
│   ├── _data/
│   │   └── nav.js            ← structure de navigation (sections + modules)
│   ├── assets/
│   │   ├── style.css         ← CSS du site
│   │   └── app.js            ← JS (filterNav uniquement)
│   ├── index.njk             ← page d'accueil
│   └── modules/
│       └── *.njk             ← 21 fichiers modules (un par module ART)
├── _site/                    ← build output (gitignore, généré par Eleventy)
├── .eleventy.js              ← config Eleventy (pathPrefix, dirs)
├── package.json
└── scripts/
    ├── extract-knowledge.js  ← parse _site/index.html → art-knowledge.json
    ├── watch.js              ← surveillance locale
    └── migrate-to-eleventy.js ← script one-shot de migration (déjà exécuté)
```

### Structure d'un fichier module

Chaque `src/modules/{id}.njk` suit ce format :

```yaml
---
layout: base.njk
title: 'Nom du Module'
permalink: '/modules/{id}/'
---

<!-- HTML du contenu du module -->
```

### Données de navigation

`src/_data/nav.js` exporte la liste des sections et modules. Pour ajouter un module :
1. Créer `src/modules/{id}.njk`
2. Ajouter l'entrée dans `src/_data/nav.js`
3. Rebuild

---

## Environnement

L'utilisateur est sur **Windows sans Node.js natif**. Toutes les commandes npm passent par **WSL Ubuntu**. Le flag `-l` (login shell) est **obligatoire** pour que npm/nvm soient dans le PATH.

### Commandes WSL

```bash
# Installation des dépendances (une seule fois ou après maj package.json)
wsl -e bash -l -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm install"

# Build Eleventy → génère _site/
wsl -e bash -l -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run build"

# Dev server local avec hot reload (http://localhost:8080)
wsl -e bash -l -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run serve"

# Générer art-knowledge.json (nécessite un build préalable)
wsl -e bash -l -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run build && npm run extract"

# Surveillance locale
wsl -e bash -l -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run watch"
```

---

## Déploiement

Pousser sur `main` → GitHub Actions (`deploy.yml`) :
1. `npm install`
2. `npm run build` → génère `_site/`
3. Upload de `_site/` vers GitHub Pages

---

## Conventions de style

- Thème sombre, variables CSS dans `:root`
- Bleu `--accent` pour exposition, orange `--accent3` pour couleur, rose `--accent4` pour détail, violet `--accent` (a78bfa) pour Looks & Presets
- Classes HTML utiles : `.tip`, `.warning`, `.param-grid`, `.workflow`, `.card`, `.module-header`
- Langue : **français uniquement**
- Les liens inter-modules utilisent des `href` réels (ex: `/ART-Guide-Photographe/modules/exposition/`), pas de `onclick`

---

## Pipeline Knowledge — art-knowledge.json

`scripts/extract-knowledge.js` parse `_site/index.html` (build nécessaire) et génère `art-knowledge.json` (base de connaissances structurée, utilisable par MCP ou tout système de génération `.arp`).

**GitHub Actions** (`extract.yml`) régénère et commite `art-knowledge.json` automatiquement à chaque push touchant `src/modules/**` ou `src/index.njk`.

**Ne jamais éditer `art-knowledge.json` à la main** — fichier généré.

### Structure du JSON généré

```json
{
  "meta": {
    "source": "ART Raw Image Processor — Documentation Photographe",
    "version": "1.0",
    "generated": "ISO timestamp",
    "total_modules": 22
  },
  "modules": [
    {
      "id": "mod-logtonemapping",
      "name": "Log Tone Mapping",
      "category": "Module Signature d'ART ⭐",
      "params": [{ "name": "...", "range": "...", "description": "..." }],
      "tips": [{ "label": "...", "content": "..." }],
      "warnings": ["..."],
      "tables": [{ "headers": ["..."], "rows": [["..."]] }]
    }
  ]
}
```
