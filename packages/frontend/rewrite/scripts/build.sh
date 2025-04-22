# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf rewrite/dist
rm -rf rewrite/static/icons
rm -rf rewrite/static/images
rm -rf rewrite/static/meta-images
cp -r public/icons rewrite/static/icons
cp -r public/images rewrite/static/images
cp -r public/meta-images rewrite/static/meta-images


esbuild \
  rewrite/src/ssr/client.tsx \
  --bundle \
  --tsconfig=rewrite/tsconfig.json \
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
  --tsconfig=rewrite/tsconfig.json \
  --jsx=automatic \
  --outfile=rewrite/dist/server/index.js
