set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

esbuild src/ssr/entry.client.tsx --bundle --outfile
tsx --watch src/index.ts
