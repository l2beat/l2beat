#! /bin/bash
set -xe

cd $(git rev-parse --show-toplevel)

GIT_HEAD=$(git rev-parse --abbrev-ref HEAD)
if [ "$GIT_HEAD" = "HEAD" ]; then
  GIT_HEAD=$(git rev-parse HEAD)
fi

GIT_MAIN=$(git merge-base HEAD main)

git checkout $GIT_MAIN
pnpm install
pnpm build:dependencies

mkdir -p /tmp/compare/main
cp packages/config/build/db.sqlite /tmp/compare/main/db.sqlite
echo $GIT_MAIN > /tmp/compare/main/commit

git checkout $GIT_HEAD
pnpm install
pnpm build:dependencies

mkdir -p /tmp/compare/pr
cp packages/config/build/db.sqlite /tmp/compare/pr/db.sqlite
echo $GIT_HEAD > /tmp/compare/pr/commit

cd packages/config
pnpm -r esbuild-register scripts/diff/index.ts /tmp/compare/diff.html

open /tmp/compare/diff.html
