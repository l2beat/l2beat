set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf dist

esbuild src/ssr/entry.client.tsx --bundle --minify --outfile=dist/static/index.js
cp -r static/* dist/static
tsx ./scripts/hashFiles.ts
tsc -p tsconfig.build.json
