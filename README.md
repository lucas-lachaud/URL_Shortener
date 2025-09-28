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


# URL Shortener - Partie 3 (API v2)

Service de réduction d'URL avec négociation de contenu JSON/HTML selon l'en-tête Accept.

## Installation

```bash
git clone https://github.com/lucas-lachaud/URL_Shortener.git
cd URL_Shortener
git checkout api-v2
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

## Routes API v2

### `GET /api-v2/`
Accueil avec négociation de contenu : nombre de liens (JSON) ou page HTML avec formulaire.

**JSON :**
```bash
http GET http://localhost:5000/api-v2/ Accept:application/json
```

**HTML :**
```bash
http GET http://localhost:5000/api-v2/ Accept:text/html
```

### `POST /api-v2/`
Créer un lien court avec négociation de contenu.

**JSON :**
```bash
http POST http://localhost:5000/api-v2/ url="https://perdu.com" Accept:application/json
```

**HTML :**
```bash
http POST http://localhost:5000/api-v2/ url="https://perdu.com" Accept:text/html
```

### `GET /api-v2/:code`
Voir les informations du lien (JSON) ou redirection (HTML).

**JSON :**
```bash
http GET http://localhost:5000/api-v2/abc123 Accept:application/json
```

**HTML (redirection) :**
```bash
http -f GET http://localhost:5000/api-v2/abc123 Accept:text/html
```

**Navigateur :**
```
http://localhost:5000/api-v2/abc123
```

## Cas d'erreur

### URL invalide :
```bash
http POST http://localhost:5000/api-v2/ url="perdu" Accept:application/json
```
Réponse :
```json
{ "error": "Invalid URL" }
```

### Code inexistant :
```bash
http GET http://localhost:5000/api-v2/xxxxxx Accept:application/json
```
Réponse :
```json
{ "error": "Not found" }
```

### Format non supporté :
```bash
http GET http://localhost:5000/api-v2/abc123 Accept:application/xml
```
Réponse : HTTP 406 Not Acceptable