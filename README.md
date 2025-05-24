# Bot WhatsApp (`ezekielncm/bot`)

## Table des matières

1. [Description](#description)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)

   * [Démarrage](#démarrage)
   * [Commandes disponibles](#commandes-disponibles)
6. [Stockage des membres](#stockage-des-membres)
7. [CI/CD (Azure Pipelines)](#ci-cd-azure-pipelines)
8. [Bonnes pratiques & améliorations](#bonnes-pratiques--am%C3%A9liorations)
9. [Contribuer](#contribuer)
10. [Licence](#licence)

---

## Description

Ce projet implémente un **bot WhatsApp** basé sur [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). Il permet :

* L’authentification via QR code (LocalAuth).
* L’écoute et le traitement de commandes textuelles et médias.
* La gestion d’une liste locale de membres enregistrés.
* La mention automatique de tous les membres d’un groupe.

---

## Prérequis

* Node.js **v20** (ou supérieur)
* npm (version fournie avec Node.js)
* Un terminal compatible pour scanner le QR code

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/ezekielncm/bot.git
cd bot

# Installer les dépendances
npm install
```

---

## Configuration

1. Aucune configuration initiale n’est requise : `LocalAuth` gère la persistance des sessions dans le répertoire `.wwebjs_auth`.
2. Facultatif : modifier le chemin d’authentification dans `main.js` si nécessaire :

   ```js
   const client = new Client({
     authStrategy: new LocalAuth({
       clientId: 'bot-1',
       dataPath: './custom_auth'
     })
   });
   ```

---

## Usage

### Démarrage

```bash
npm start
```

Au premier lancement, un QR code s’affiche en console :

1. Ouvrez WhatsApp sur votre mobile
2. Allez dans **Paramètres > Appareils connectés**
3. Scannez le QR code
4. Le bot est prêt à recevoir des messages

### Commandes disponibles

| Commande                   | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `!ping`                    | Vérifie la réactivité : réponse `pong`.                       |
| `!menu`                    | Affiche la liste des commandes.                               |
| `!register <pseudo> <nom>` | Enregistre l’utilisateur dans `membres.json`.                 |
| `!list`                    | Affiche la liste des membres enregistrés (groupe courant).    |
| `!tagall`                  | Mentionne tous les participants du groupe.                    |
| `!media`                   | (Stub) Traite un média et renvoie une image selon la logique. |
| `!hidetag`                 | (À implémenter) Mentionner sans affichage de tags visibles.   |

*Note : la commande `!hidetag` est déclarée mais non implémentée.*

---

## Stockage des membres

* Fichier : `membres.json`
* Structure :

  ```json
  [
    {
      "pseudo": "utilisateur",
      "nom": "Nom Prénom",
      "phone": "+33123456789",
      "chatId": "123456789@c.us"
    }
  ]
  ```
* Gestion des doublons assurée lors de `!register`.

---

## CI/CD (Azure Pipelines)

Fichier : `azure-pipelines.yml`

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

steps:
  - task: UseNode@1
    inputs:
      version: '20.x'

  - script: |
      npm install
      npm start -- --ci-test
    displayName: 'Install and Test'
```

*Le pipeline exécute l’installation et le lancement du bot (ajouter un flag `--ci-test` pour exécuter des tests unitaires futurs).*

---

## Bonnes pratiques & améliorations

1. **Modularisation** : extraire chaque commande dans un module dédié (`commands/`).
2. **Tests unitaires** : intégrer Jest/Mocha + assertions sur l’enregistrement et le tagging.
3. **Logger structuré** : remplacer `console` par `winston` ou `pino`.
4. **Persistence évolutive** : migrer vers une base de données légère (SQLite, MongoDB).
5. **Sécurité** : chiffrer ou restreindre l’accès à `membres.json`.
6. **Documentation** : maintenir un changelog et un guide de contribution.

---

## Contribuer

1. Forkez le projet
2. Créez une branche (*feature/x* ou *bugfix/x*)
3. Implémentez vos changements
4. Ouvrez un Pull Request

Merci de respecter les conventions de code et d’ajouter des tests pour chaque nouvelle fonctionnalité.

---

## Licence

MIT © 2025
