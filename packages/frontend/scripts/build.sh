# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf dist
rm -f static/index.js

tailwindcss \
  -i src/styles/globals.css \
  -o ./static/index.css \
  --minify

node -r esbuild-register ./scripts/hashFiles.ts
vite build --mode production

esbuild \
  src/index.ts \
  --bundle \
  --minify \
  --platform=node \
  --packages=external \
  --jsx=automatic \
  --outfile=dist/server/index.js
