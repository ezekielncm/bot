#!/usr/bin/env bash
set -e

echo "→ Install deps"
npm ci

echo "→ Lint & Test"
# npm run lint
npm test

echo "→ Start bot in background"
node main.js & BOT_PID=$!
sleep 10

echo "→ Vérifier les logs"
logs=$(tail -n 20 /root/.wwebjs_auth/*.log || echo "No logs")
echo "$logs"

kill $BOT_PID
echo "OK ✓"
