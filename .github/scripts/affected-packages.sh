#!/usr/bin/env bash
# Lists the workspace packages a change reaches: the ones it changes and every
# package that depends on them (turbo ls --affected). Shared by
# .github/workflows/affected-packages.yml (previews and deploys) and
# .github/actions/affected (CI's per-job check). Writes to $GITHUB_OUTPUT:
#
#   packages  JSON array of package names, e.g. ["@l2beat/frontend"]
#   outside   true when the change touches a file outside packages/
#
# On a pull request it compares the PR head with the commit it branched from,
# like the PR's "Files changed" tab, so the list covers the whole PR, not just
# the last push. Not the merge commit: when a PR is retargeted, GitHub fires
# the event before it rebuilds refs/pull/N/merge, which then still diffs
# against the old base. The base branch is read from the API, not the event,
# which can name the old base right after a retarget. Elsewhere (main) it
# compares the commit with the one before it.
#
# Needs EVENT, and on a pull request PR, HEAD_SHA and GH_TOKEN. It fetches
# only the commits and trees the diff needs (a blobless fetch), and reads the
# workspace from package.json files and the lockfile, so it needs no install.
set -euo pipefail

if [[ "$EVENT" == pull_request ]]; then
  base_ref=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$PR" --jq .base.ref)
  compare=$(gh api "repos/$GITHUB_REPOSITORY/compare/$base_ref...$HEAD_SHA" \
    --jq '"\(.merge_base_commit.sha) \(.ahead_by + 1)"')
  read -r base depth <<< "$compare"
  head=$HEAD_SHA
  git fetch --quiet --no-tags --filter=blob:none --depth="$depth" origin "$head"
else
  head=$(git rev-parse HEAD)
  git fetch --quiet --no-tags --filter=blob:none --depth=2 origin "$head"
  base=$(git rev-parse "$head^1")
fi

changed=$(git diff --name-only "$base" "$head")
outside=$(grep -v '^packages/' <<< "$changed" || true)

version=$(grep -oP '^  turbo@\K[0-9.]+(?=:)' pnpm-lock.yaml | head -1)
listed=$(TURBO_SCM_BASE="$base" TURBO_SCM_HEAD="$head" \
  npx --yes "turbo@$version" ls --affected --output=json)
packages=$(jq -c '[.packages.items[].name]' <<< "$listed")

echo "Affected packages: $packages"
[[ -n "$outside" ]] && echo "Changed outside packages/:"$'\n'"$outside"
{
  echo "packages=$packages"
  echo "outside=$([[ -n "$outside" ]] && echo true || echo false)"
} >> "$GITHUB_OUTPUT"
