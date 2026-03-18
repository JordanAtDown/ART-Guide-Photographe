# CLAUDE.md — ART Guide Photographe

## Présentation du projet

Documentation HTML du logiciel **ART** (Another RawTherapee, dérivé de RawTherapee), destinée aux photographes. Le workflow couvert est **RAW → TIFF → Affinity Photo**.

## Architecture

- **Un seul fichier** : `index.html` (HTML5, CSS et JS embarqués, ~2400+ lignes)
- Single Page Application minimaliste : JS gère la navigation entre modules via `show(id)`
- Pipeline Node.js pour extraction de la knowledge base (voir section ci-dessous)

## Modifier la documentation

Éditer directement [index.html](index.html) :

- **Ajouter un module** : copier un `<div class="module" id="mod-xxx">` existant, puis ajouter le lien de nav dans la sidebar
- **Modifier un paramètre** : chercher le texte dans les `<div class="param-grid">` ou `<table>`
- **Ajouter un look/preset** : section `mod-looks`
- **Langue** : français uniquement

## Déploiement

Pousser sur `main` → GitHub Actions déclenche automatiquement la publication sur GitHub Pages.

URL de production : `https://jordanatdown.github.io/ART-Guide-Photographe/`

## Conventions

- Thème sombre, variables CSS dans `:root`
- Bleu `--accent` pour exposition, orange `--accent3` pour couleur, rose `--accent4` pour détail
- Classes utiles : `.tip` (conseil), `.warning` (mise en garde), `.param-grid`, `.workflow-steps`
- Ne pas externaliser le CSS ou le JS — garder tout dans `index.html`

## Pipeline Knowledge — art-knowledge.json

Le projet inclut un pipeline d'extraction qui parse `index.html` et génère `art-knowledge.json` (base de connaissances structurée, utilisable par MCP ou tout système de génération `.arp`).

### Environnement

L'utilisateur est sur **Windows sans Node.js natif**. Toutes les commandes npm passent par **WSL Ubuntu**.

### Commandes WSL

```bash
# Installation des dépendances (une seule fois ou après maj package.json)
wsl -e bash -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm install"

# Générer art-knowledge.json
wsl -e bash -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run extract"

# Surveillance locale (regénère auto à chaque sauvegarde de index.html)
wsl -e bash -c "cd /mnt/d/developpement.code/ART-guide-photographe && npm run watch"
```

### Quand relancer l'extraction

- Après **tout ajout ou refonte d'un module** dans `index.html`
- Avant de commiter si `index.html` a changé (ou laisser GitHub Actions le faire)

### Règles importantes

- **Ne jamais éditer `art-knowledge.json` à la main** — fichier généré
- **GitHub Actions** (`extract.yml`) régénère et commite `art-knowledge.json` automatiquement à chaque push touchant `index.html`
- Si le workflow échoue, relancer l'extraction manuellement via WSL et commiter

### Structure du JSON généré

```json
{
  "meta": {
    "source": "ART Raw Image Processor — Documentation Photographe",
    "version": "1.0",
    "generated": "ISO timestamp",
    "total_modules": 22,
    "description": "..."
  },
  "modules": [
    {
      "id": "mod-logtonemapping",
      "name": "Log Tone Mapping",
      "subtitle": "...",
      "category": "Module Signature d'ART ⭐",
      "params": [{ "name": "...", "range": "...", "description": "..." }],
      "tips": [{ "label": "...", "content": "..." }],
      "warnings": ["..."],
      "tables": [{ "headers": ["..."], "rows": [["..."]] }]
    }
  ]
}
```

### Fichiers du pipeline

| Fichier | Rôle |
|---|---|
| `scripts/extract-knowledge.js` | Parser HTML → JSON |
| `scripts/watch.js` | Surveillance locale avec chokidar |
| `package.json` | Dépendances + scripts npm |
| `.github/workflows/extract.yml` | CI auto sur push GitHub |
| `art-knowledge.json` | Fichier généré — ne pas éditer |
