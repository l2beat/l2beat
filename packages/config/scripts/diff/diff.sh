#! /bin/bash
set -xe

cd $(git rev-parse --show-toplevel)

GIT_HEAD=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse HEAD)
GIT_MAIN=$(git merge-base origin/main $GIT_HEAD)

# Copied out because checking out main may remove it
SNAPSHOT=$(mktemp)
cp packages/config/scripts/diff/snapshot.sh $SNAPSHOT

git checkout $GIT_MAIN
bash $SNAPSHOT main

git checkout $GIT_HEAD
bash $SNAPSHOT pr

cd packages/config
mkdir -p /tmp/compare/out
# pnpm exec puts node_modules/.bin on PATH; bare `tsx` is not found when this
# script is invoked directly (e.g. `bash diff.sh`) instead of via pnpm
pnpm exec tsx scripts/diff/index.ts /tmp/compare/out/index.html /tmp/compare/out/index-llms.txt

if [ -z "$GITHUB_ACTIONS" ]; then
  open /tmp/compare/out/index.html
fi
