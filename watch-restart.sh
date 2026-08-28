#!/bin/bash
MARKER="dist/.watch_marker"

mkdir -p dist
touch "$MARKER"

echo "Watching dist/ for changes..."
while true; do
  if find dist -name "*.js" -newer "$MARKER" 2>/dev/null | grep -q .; then
    touch "$MARKER"
    echo "$(date '+%H:%M:%S') Changes detected — restarting n8n..."
    docker compose restart n8n
  fi
  sleep 1
done
