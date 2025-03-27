# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf dist

esbuild \
  src/ssr/client.tsx \
  --bundle \
  --minify \
  --outfile=static/index.js
tailwindcss \
  -i src/styles/globals.css \
  -o ./static/index.css
tsx ./scripts/hashFiles.ts
tsc -p tsconfig.build.json