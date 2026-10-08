#! /bin/bash
# Builds the config database of the repository at the working directory into
# /tmp/compare/<name>, so CI can build main and the PR side by side in
# separate checkouts.
set -xe

NAME=$1
cd $(git rev-parse --show-toplevel)

pnpm install
pnpm build:dependencies:config
cd packages/config
pnpm build
cd ../..

mkdir -p /tmp/compare/$NAME
cp packages/config/build/db.sqlite /tmp/compare/$NAME/db.sqlite
git rev-parse HEAD > /tmp/compare/$NAME/commit
