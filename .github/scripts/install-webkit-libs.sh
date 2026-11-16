#!/usr/bin/env bash
# Installs the system libraries Playwright's WebKit needs, from the .deb files
# in ~/.cache/webkit-packages where the cache has them. Runs before
# `pnpm install`, so it runs the Playwright version from the lockfile
# (PLAYWRIGHT_VERSION) through npx.
set -euo pipefail

# An empty version would make npx install the latest Playwright, whose
# libraries may not match the browsers the tests run
: "${PLAYWRIGHT_VERSION:?not found in pnpm-lock.yaml}"

mkdir -p ~/.cache/webkit-packages
find ~/.cache/webkit-packages -name '*.deb' -exec sudo cp -t /var/cache/apt/archives {} +

log="$RUNNER_TEMP/install-deps.log"
# On an Ubuntu release it does not know, install-deps warns and exits 0, and
# WebKit then fails in the tests instead
npx --yes "playwright@$PLAYWRIGHT_VERSION" install-deps webkit 2>&1 | tee "$log"
if grep -q 'Cannot install dependencies' "$log"; then
  echo "::error::Playwright cannot install WebKit's system libraries on $ImageOS"
  exit 1
fi
