# REPONSES.md

## Questions et réponses sur l'application URL Shortener

### 1. Commande HTTPie correspondante à la commande curl POST

**Commande curl donnée dans la documentation :**
```bash
curl --include --header 'Accept: application/json' --header 'Content-Type: application/json' --request POST http://localhost:8080/api-v1/ --data '{"url": "https://perdu.com"}'
```

**Commande HTTPie équivalente :**
```bash
http POST http://localhost:8080/api-v1/ url="https://perdu.com"
```

*Note : HTTPie simplifie grandement la syntaxe en détectant automatiquement le Content-Type JSON et l'Accept header.*

### 2. Différences entre les modes production et développement

**Mode production (`npm run prod`) :**
- Utilise directement `node src/app.js`
- Pas de rechargement automatique
- Logs minimaux
- Optimisé pour les performances
- Pas de surveillance des changements de fichiers

**Mode développement (`npm run dev`) :**
- Utilise `nodemon src/app.js`
- Rechargement automatique à chaque modification de fichier
- Logs détaillés pour le debugging
- Surveillance continue des fichiers
- Redémarrage automatique en cas d'erreur

**Principales différences :**
1. **Rechargement automatique** : Nodemon surveille les changements
2. **Performance** : Mode prod plus rapide, mode dev plus pratique
3. **Debugging** : Plus d'informations en mode dev
4. **Consommation mémoire** : Mode dev consomme plus de ressources

### 3. Script npm pour formatter les fichiers .mjs

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.mjs\""
  }
}
```

*Note : Nécessite l'installation de Prettier avec `npm install --save-dev prettier`*

### 4. Configuration Express pour supprimer l'en-tête X-Powered-By

```javascript
// Dans src/app.js, ajouter après la création de l'app Express
app.disable('x-powered-by');

// Ou alternative :
app.set('x-powered-by', false);
```

### 5. Middleware pour ajouter l'en-tête X-API-version

```javascript
// Dans src/app.js, ajouter ce middleware avant les routes
const packageJson = require('../package.json');

// Middleware pour ajouter la version de l'API
app.use((req, res, next) => {
  res.setHeader('X-API-version', packageJson.version);
  next();
});
```

### 6. Middleware Express pour favicon.ico

```javascript
// Installation nécessaire : npm install serve-favicon
const favicon = require('serve-favicon');
const path = require('path');

// Dans src/app.js, ajouter après les autres middlewares
app.use(favicon(path.join(__dirname, '../static/logo_univ_16.png')));
```

### 7. Documentation du driver SQLite

**Links vers la documentation :**
- Documentation officielle du package sqlite3 : https://github.com/TryGhost/node-sqlite3
- API Documentation : https://github.com/TryGhost/node-sqlite3/wiki/API
- SQLite.org (référence SQLite) : https://sqlite.org/docs.html

### 8. Gestion de la connexion à la base de données

**Ouverture de la connexion :**
- Au démarrage de l'application dans `startServer()` via `initDatabase()`
- Une seule fois au lancement de l'application
- Connexion persistante stockée dans la variable globale `db`

**Fermeture de la connexion :**
- **Actuellement : Jamais fermée explicitement dans le code**
- Se ferme automatiquement quand le processus Node.js se termine
- **Amélioration recommandée :** Ajouter un gestionnaire de signal pour fermer proprement :

```javascript
process.on('SIGINT', () => {
  if (db) {
    db.close((err) => {
      if (err) console.error('Error closing database:', err);
      else console.log('Database connection closed.');
      process.exit(0);
    });
  }
});
```

### 9. Gestion du cache par Express avec le navigateur

**Test effectué :**
1. **Première visite** (mode privé) : Requête complète au serveur
2. **Deuxième visite** : Utilisation du cache navigateur (304 Not Modified)
3. **Ctrl+Shift+R** : Force le rechargement, ignore le cache

**Conclusion sur la gestion du cache :**
- Express utilise par défaut des en-têtes de cache pour les ressources statiques
- Le middleware `express.static()` ajoute automatiquement les en-têtes `ETag` et `Last-Modified`
- Le navigateur utilise ces en-têtes pour optimiser les requêtes suivantes
- `Ctrl+Shift+R` force un rechargement complet en ignorant le cache
- Express répond avec un code 304 (Not Modified) quand la ressource n'a pas changé

### 10. Partage de base de données entre instances

**Configuration testée :**
- Instance 1 : Port 8080 (`npm run dev`)
- Instance 2 : Port 8081 (`cross-env PORT=8081 NODE_ENV=development npx nodemon src/app.js`)

**Résultat observé :**
Les liens créés sur une instance sont visibles sur l'autre instance.

**Explication :**
1. **Base de données partagée** : Les deux instances utilisent le même fichier SQLite (`database/database.sqlite`)
2. **Fichier unique** : SQLite stocke toutes les données dans un seul fichier sur le disque
3. **Accès concurrent** : SQLite permet l'accès concurrent en lecture/écriture
4. **Synchronisation** : Les modifications d'une instance sont immédiatement visibles par l'autre
5. **Même configuration** : Les deux instances partagent le même fichier `.env` et la même configuration `DB_FILE`

**Note technique :** SQLite gère automatiquement les verrous de fichier pour éviter les conflits lors d'écritures simultanées, ce qui permet ce partage de données entre processus.

---

## Tags Git appliqués

- `reponses` : Version avec les réponses aux questions techniques