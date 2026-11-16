#!/usr/bin/env bash
# Writes affected=true|false to $GITHUB_OUTPUT. See action.yml.
set -euo pipefail

say() { echo "affected=$1" >> "$GITHUB_OUTPUT"; echo "$2"; }

if [[ "$EVENT" != pull_request ]]; then
  say true "Not a pull request ($EVENT): running everything"
  exit 0
fi

# Like the PR's "Files changed" tab: the head against where it branched off.
# The base branch comes from the API, not the event, which can name the old
# base right after a retarget. A blobless fetch brings the commits and trees
# for the diff without the files' contents.
base_ref=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$PR" --jq .base.ref)
read -r base depth < <(gh api "repos/$GITHUB_REPOSITORY/compare/$base_ref...$HEAD_SHA" \
  --jq '"\(.merge_base_commit.sha) \(.ahead_by + 1)"')
git fetch --quiet --no-tags --filter=blob:none --depth="$depth" origin "$HEAD_SHA"

outside=$(git diff --name-only "$base" "$HEAD_SHA" | grep -v '^packages/' || true)
if [[ -n "$outside" ]]; then
  say true "Changes outside packages/, running everything:"$'\n'"$outside"
  exit 0
fi

# turbo ls --affected lists the changed packages and every package that
# depends on them. It reads the workspace from package.json files and the
# lockfile, so it needs no install.
version=$(grep -oP '^  turbo@\K[0-9.]+(?=:)' pnpm-lock.yaml | head -1)
affected=$(TURBO_SCM_BASE="$base" TURBO_SCM_HEAD="$HEAD_SHA" \
  npx --yes "turbo@$version" ls --affected --output=json | jq -r '.packages.items[].name')
echo "Affected packages:"$'\n'"${affected:-(none)}"

for package in $PACKAGES; do
  if grep -qxF "$package" <<< "$affected"; then
    say true "$package is affected: running"
    exit 0
  fi
done
say false "None of $PACKAGES is affected: skipping"
