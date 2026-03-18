# CLAUDE.md — ART Guide Photographe

## Présentation du projet

Documentation HTML du logiciel **ART** (Another RawTherapee, dérivé de RawTherapee), destinée aux photographes. Le workflow couvert est **RAW → TIFF → Affinity Photo**.

## Architecture

- **Un seul fichier** : `index.html` (HTML5, CSS et JS embarqués, ~1250 lignes)
- Pas de build, pas de dépendances npm, pas de framework
- Single Page Application minimaliste : JS gère la navigation entre 18 modules via `show(id)`

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
