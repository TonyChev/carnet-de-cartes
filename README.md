# Carnet de cartes

Web app pour poser des marqueurs sur les cartes HD de tes jeux (GTA 6 ou autres) : zoom, déplacement, types de marqueurs personnalisables (nom, couleur, icône), plusieurs cartes. Tout est sauvegardé sur **Supabase** et synchronisé entre téléphone et PC.

Site statique (HTML/CSS/JS, sans build), hébergé sur **GitHub Pages**.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page et ses styles |
| `app.js` | Toute la logique (carte, marqueurs, Supabase) |
| `config.js` | URL et clé publique de ton projet Supabase |
| `supabase/schema.sql` | Tables, sécurité et stockage à créer dans Supabase |

## Installation

### 1. Supabase

1. Sur [supabase.com](https://supabase.com/dashboard), crée un projet (ex. « Carnet de cartes »). L'offre gratuite permet 2 projets actifs. Tu peux aussi réutiliser un projet existant : toutes les tables commencent par `carnet_`, donc rien n'entre en conflit.
2. Ouvre **SQL Editor** > **New query**, colle le contenu de `supabase/schema.sql` et clique sur **Run**.
3. Dans **Authentication** > **URL Configuration**, mets dans **Site URL** l'adresse GitHub Pages (étape 3), par exemple `https://tonychev.github.io/carnet-de-cartes/`.
4. Optionnel : dans **Authentication** > **Sign In / Providers** > **Email**, désactive **Confirm email** si tu ne veux pas avoir à confirmer ton adresse.
5. Dans **Project Settings** > **API**, copie la **Project URL** et la clé **anon** (ou **publishable**).

### 2. Configuration

Remplis `config.js` :

```js
window.CARNET_CONFIG = {
  SUPABASE_URL: "https://xxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJ...",
};
```

La clé anon est publique par conception : la sécurité vient des règles RLS du schéma, qui font que chaque compte ne voit que ses propres données. Ne mets **jamais** la clé `service_role` dans ce fichier.

### 3. GitHub Pages

Dans le dépôt GitHub : **Settings** > **Pages** > **Source : Deploy from a branch** > branche `main`, dossier `/ (root)`.

L'appli sera disponible à l'adresse `https://<utilisateur>.github.io/carnet-de-cartes/`.

GitHub Pages sur un dépôt **privé** demande un abonnement GitHub Pro (ou Team/Enterprise). Avec un compte gratuit, passe le dépôt en public. Ça ne pose pas de problème de sécurité : le code ne contient aucun secret, et tes données restent protégées par ton compte.

## Utilisation

- Crée un compte (e-mail et mot de passe) dans l'appli, puis connecte-toi avec ce même compte sur tous tes appareils.
- Ouvre **Mes cartes** (le nom en haut à gauche) pour ajouter une carte : un nom et une image HD (JPEG, PNG ou WebP). Une image de plus de 45 Mo est recompressée automatiquement.
- Touche la carte pour poser un marqueur. Touche un marqueur pour le modifier, le déplacer ou le supprimer.
- Le bouton **N marqueurs** ouvre la liste : tu peux filtrer par type, chercher dans les notes et modifier les types (crayon) ou en créer.

## Tester en local

```bash
npx serve .
```
