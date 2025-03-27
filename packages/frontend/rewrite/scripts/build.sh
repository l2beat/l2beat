# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf rewrite/dist

esbuild \
  rewrite/src/ssr/client.tsx \
  --bundle \
  --minify \
  --outfile=rewrite/static/index.js
tailwindcss \
  -i rewrite/src/styles/globals.css \
  -o ./rewrite/static/index.css
tsx ./rewrite/scripts/hashFiles.ts

esbuild \
  rewrite/src/index.ts \
  --bundle \
  --platform=node \
  --packages=external \
  --jsx=automatic \
  --outfile=rewrite/dist/server/index.js
