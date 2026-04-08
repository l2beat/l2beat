# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf dist
rm -f static/index.js

node -r esbuild-register ./scripts/hashFiles.ts
vite build --mode production

tsx scripts/buildServer.ts --prod
