# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

rm -rf dist

esbuild \
  src/ssr/ClientEntry.tsx \
  --bundle \
  --minify \
  --outfile=static/index.js &
esbuild_pid=$!

tailwindcss \
  -i src/styles/globals.css \
  -o ./static/index.css \
  --minify &
tailwind_pid=$!

wait "$esbuild_pid"
wait "$tailwind_pid"

node -r esbuild-register ./scripts/hashFiles.ts

esbuild \
  src/index.ts \
  --bundle \
  --minify \
  --platform=node \
  --packages=external \
  --jsx=automatic \
  --outfile=dist/server/index.js
