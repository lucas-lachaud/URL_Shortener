# URL Shortener - Partie 2 (API v1)

Service simple de réduction d'URL : créer un lien court, rediriger vers l'URL originale et compter les visites.

## Installation

```bash
git clone https://github.com/lucas-lachaud/URL_Shortener.git
cd URL_Shortener
git checkout api-v1
npm install
```

## Lancement

- **Développement** (reload automatique) :
```bash
npm run dev
```

- **Production :**
```bash
npm run prod
```

L'application écoute sur `http://localhost:5000`.

## Routes API v1

### `GET /api-v1/`
Liste de tous les liens créés :
```bash
http http://localhost:5000/api-v1/
```

### `POST /api-v1/`
Créer un lien court :
```bash
http POST http://localhost:5000/api-v1/ url="https://perdu.com"
```

### `GET /api-v1/status/:code`
Voir les statistiques d'un lien :
```bash
http http://localhost:5000/api-v1/status/abc123
```

### `GET /api-v1/:code`
Redirection vers l'URL originale et incrémentation du compteur :
```bash
curl -I http://localhost:5000/api-v1/abc123
```
