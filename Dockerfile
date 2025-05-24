# Étape 1 – build
FROM node:20-alpine AS build
WORKDIR /app

# Installer les dépendances système nécessaires à Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Copier et installer les dépendances (inclut devDependencies pour les tests)
COPY package*.json ./
RUN npm ci --production=false

# Copier le code source
COPY . .

# (Optionnel) Lancer les tests
# RUN npm test

# Étape 2 – runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Installer les mêmes dépendances système
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Copier et installer uniquement les dépendances de production
COPY package*.json ./
RUN npm ci --only=production

# Copier le build final
COPY --from=build /app .

# Pointer Puppeteer vers Chromium système
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Créer un utilisateur non-root
RUN addgroup -S bot && adduser -S bot -G bot
USER bot

# Exposer un port pour healthcheck si nécessaire
EXPOSE 3000

# Commande de démarrage
CMD ["node", "main.js"]
