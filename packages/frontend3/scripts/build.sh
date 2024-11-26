#!/bin/bash

COLOR='\033[0;34m'
NO_COLOR='\033[0m'

echo -e "${COLOR}[build] Cleaning dist${NO_COLOR}"
rm -rf dist

echo -e "${COLOR}[build] Building styles${NO_COLOR}"
tailwindcss --minify --input ./client/styles/main.css --output ./client/static/main.css

echo -e "${COLOR}[build] Building scripts${NO_COLOR}"
esbuild --minify --bundle --outfile=client/static/main.js client/scripts/main.ts

echo -e "${COLOR}[build] Content-hashing static assets${NO_COLOR}"
mkdir -p dist/static
node --require esbuild-register scripts/hashAssets.ts

echo -e "${COLOR}[build] Building server code${NO_COLOR}"
tsc --project tsconfig.build.json

echo -e "${COLOR}[build] Done${NO_COLOR}"
