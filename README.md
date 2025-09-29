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

# URL Shortener - Partie 4 (Client AJAX)

Interface web utilisant AJAX pour interagir avec l'API v2.

## Utilisation

1. **Lancer le serveur Node.js :**
```bash
npm run dev
```

2. **Ouvrir dans le navigateur :**
```
http://localhost:5000/index.html
```

3. **Saisir une URL et cliquer sur Raccourcir.**

4. **Cliquer sur Copier l'URL pour copier le lien.**


# URL Shortener - Partie 5 : Gestion de la suppression des liens

Service de réduction d'URL avec fonctionnalité de suppression sécurisée par clé secrète.

```bash
git clone https://github.com/lucas-lachaud/URL_Shortener.git
cd URL_Shortener
git checkout api-v2-delete
npm install
```

### Installation et démarrage

- **Développement** (reload automatique) :
```bash
npm run dev
```

- **Production** :
```bash
npm run prod
```

L'application écoute sur http://localhost:5000.

### Fonctionnalités

Cette version inclut toutes les fonctionnalités des versions précédentes plus :
- Suppression sécurisée des liens raccourcis
- Authentification par clé secrète (`X-API-Key`)
- Documentation OpenAPI étendue avec gestion de l'authentification

### API Endpoints

#### Supprimer un lien raccourci

**DELETE /api-v2/:url**

Supprime un lien raccourci existant. Nécessite une authentification par clé secrète.

**En-têtes requis :**
- `X-API-Key`: Clé secrète générée lors de la création du lien

**Codes de réponse :**
- `200` : Lien supprimé avec succès
- `401` : En-tête X-API-Key manquant
- `403` : Clé secrète invalide
- `404` : Lien non trouvé

**Exemples :**

Avec curl :
```bash
curl --include --header 'Accept: application/json' --header 'X-API-Key: RatQak' --request DELETE http://localhost:5000/api-v2/HdPWk7
```

Avec HTTPie :
```bash
http DELETE http://localhost:5000/api-v2/HdPWk7 X-API-Key:RatQak
```

### Workflow complet avec suppression

#### 1. Créer un lien court
```bash
http POST http://localhost:5000/api-v2/ url="https://perdu.com" Accept:application/json
```

**Réponse :**
```json
{
  "short_url": "HdPWk7",
  "original_url": "https://perdu.com",
  "secret": "RatQak",
  "created_at": "2024-03-15T10:30:00Z"
}
```

⚠️ **Important** : Conservez la clé secrète `secret` pour pouvoir supprimer le lien plus tard.

#### 2. Consulter les informations du lien
```bash
http GET http://localhost:5000/api-v2/HdPWk7 Accept:application/json
```

**Réponse :**
```json
{
  "short_url": "HdPWk7",
  "original_url": "https://perdu.com",
  "visits": 0,
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Note :** La clé secrète n'est jamais exposée dans les réponses GET.

#### 3. Utiliser la redirection
```bash
curl -I http://localhost:5000/api-v2/HdPWk7
```

#### 4. Supprimer le lien
```bash
http DELETE http://localhost:5000/api-v2/HdPWk7 X-API-Key:RatQak
```

**Réponse :** `200 OK`

### Documentation interactive

La documentation Swagger est disponible à l'adresse :
http://localhost:5000/docs

L'interface inclut un champ d'authentification avec un cadenas 🔒 pour saisir la clé `X-API-Key` lors des tests de suppression.

### Gestion des erreurs

#### Lien inexistant
```bash
http DELETE http://localhost:5000/api-v2/inexistant X-API-Key:RatQak
```
**Réponse :** `404 Not Found`

#### Clé secrète manquante
```bash
http DELETE http://localhost:5000/api-v2/HdPWk7
```
**Réponse :** `401 Unauthorized`

#### Clé secrète incorrecte
```bash
http DELETE http://localhost:5000/api-v2/HdPWk7 X-API-Key:mauvaise-cle
```
**Réponse :** `403 Forbidden`

### Base de données

La base de données SQLite a été étendue avec un nouveau champ `secret` :

```sql
CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_url TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  visits INTEGER DEFAULT 0,
  secret TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Important :** Supprimez `database/database.sqlite` avant le premier lancement pour que la nouvelle structure soit appliquée.

### Sécurité

- Chaque lien possède une clé secrète unique générée aléatoirement
- La clé secrète est retournée uniquement lors de la création
- Seul l'auteur du lien (possesseur de la clé) peut le supprimer
- La clé secrète n'est jamais exposée dans les endpoints de consultation

