# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf rewrite/dist

esbuild \
  rewrite/src/ssr/client.tsx \
  --define:process.env.NODE_ENV=\"production\" \
  --bundle \
  --minify \
  --tsconfig=rewrite/tsconfig.json \
  --outfile=rewrite/static/index.js &
tailwindcss \
  -i rewrite/src/styles/globals.css \
  -o ./rewrite/static/index.css \
  --minify &
wait
tsx ./rewrite/scripts/hashFiles.ts

esbuild \
  rewrite/src/index.ts \
  --define:process.env.NODE_ENV=\"production\" \
  --bundle \
  --platform=node \
  --packages=external \
  --tsconfig=rewrite/tsconfig.json \
  --jsx=automatic \
  --outfile=rewrite/dist/server/index.js
