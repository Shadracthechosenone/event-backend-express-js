# 🎉 Event Backend API

> API REST pour la gestion d'événements — construite avec Express.js, TypeScript, Prisma et PostgreSQL.

---

## 🛠️ Stack technique

| Technologie     | Rôle                              |
|-----------------|-----------------------------------|
| Express.js      | Framework HTTP                    |
| TypeScript      | Typage statique                   |
| Prisma          | ORM / gestion de la base de données |
| PostgreSQL      | Base de données relationnelle     |
| JWT             | Authentification (access + refresh tokens) |
| bcrypt          | Hashage des mots de passe         |
| Zod *(optionnel)* | Validation des données entrantes |

---

## 📁 Structure du projet

```
event_back/
├── prisma/
│   ├── schema.prisma       # Schéma de la base de données
│   └── migrations/         # Historique des migrations
├── src/
│   ├── config/             # Configuration (env, DB, etc.)
│   ├── controllers/        # Logique des routes
│   ├── middlewares/        # Auth, gestion d'erreurs, etc.
│   ├── routes/             # Définition des endpoints
│   ├── services/           # Logique métier
│   ├── types/              # Types TypeScript
│   └── index.ts            # Point d'entrée
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚙️ Installation

### Prérequis

- Node.js >= 18
- PostgreSQL
- npm ou yarn

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/ton-username/event_back.git
cd event_back

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner les valeurs dans .env

# Appliquer les migrations Prisma
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Lancer le serveur en développement
npm run dev
```




## 🔑 Authentification

L'API utilise une architecture **JWT avec rotation des refresh tokens** :

- **Access token** : durée courte (15 min), envoyé dans le header `Authorization: Bearer <token>`
- **Refresh token** : durée longue (7 jours), stocké en base via le modèle `Session` Prisma
- **Rotation** : à chaque refresh, l'ancien token est invalidé et un nouveau est émis

---

## 📡 Endpoints

### Auth

| Méthode | Endpoint              | Description                  | Accès  |
|---------|-----------------------|------------------------------|--------|
| POST    | `/api/auth/register`  | Créer un compte              | Public |
| POST    | `/api/auth/login`     | Se connecter                 | Public |
| POST    | `/api/auth/refresh`   | Renouveler l'access token    | Public |
| POST    | `/api/auth/logout`    | Se déconnecter               | Auth   |

### Événements

| Méthode | Endpoint              | Description                  | Accès  |
|---------|-----------------------|------------------------------|--------|
| GET     | `/api/events`         | Lister tous les événements   | Public |
| GET     | `/api/events/:id`     | Détail d'un événement        | Public |
| POST    | `/api/events`         | Créer un événement           | Auth   |
| PUT     | `/api/events/:id`     | Modifier un événement        | Auth   |
| DELETE  | `/api/events/:id`     | Supprimer un événement       | Auth   |

> **Note :** D'autres routes (participants, catégories, etc.) seront ajoutées au fur et à mesure.

---

## 🧪 Scripts disponibles

```bash
npm run dev       # Démarrer en mode développement (ts-node / nodemon)
npm run build     # Compiler TypeScript → JavaScript
npm run start     # Lancer la version compilée
npm run lint      # Linter le code
```

---

## 🗄️ Modèles Prisma (aperçu)

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String
  sessions  Session[]
  events    Event[]
  createdAt DateTime  @default(now())
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
}

model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  date        DateTime
  location    String?
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🚧 État du projet

Ce projet est en cours de refactoring. Migration vers Express.js avec une architecture plus propre et modulaire.

- [x] Configuration du projet (TypeScript + Express)
- [x] Connexion PostgreSQL via Prisma
- [x] Authentification JWT (access + refresh tokens)
- [ ] CRUD événements
- [ ] Gestion des participants
- [ ] Upload d'images
- [ ] Tests unitaires

---

## 👤 Auteur

**Shad** — Développeur Full-Stack (en formation)  
[GitHub](https://github.com/ton-username) · [LinkedIn](https://linkedin.com/in/ton-profil)

---

## 📄 Licence

Ce projet est open source — [MIT](./LICENSE)
