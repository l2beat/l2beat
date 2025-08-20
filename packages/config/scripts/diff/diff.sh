#! /bin/bash
set -xe

cd $(git rev-parse --show-toplevel)

GIT_HEAD=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse HEAD)
GIT_MAIN=$(git merge-base origin/main $GIT_HEAD)

git checkout $GIT_MAIN
pnpm install
pnpm build:dependencies:config
cd packages/config
pnpm build
cd ../..

mkdir -p /tmp/compare/main
cp packages/config/build/db.sqlite /tmp/compare/main/db.sqlite
git rev-parse HEAD > /tmp/compare/main/commit

git checkout $GIT_HEAD
pnpm install
pnpm build:dependencies:config
cd packages/config
pnpm build
cd ../..

mkdir -p /tmp/compare/pr
cp packages/config/build/db.sqlite /tmp/compare/pr/db.sqlite
git rev-parse HEAD > /tmp/compare/pr/commit

cd packages/config
mkdir -p /tmp/compare/out
node -r esbuild-register scripts/diff/index.ts /tmp/compare/out/index.html

if [ -z "$GITHUB_ACTIONS" ]; then
  open /tmp/compare/out/index.html
fi
