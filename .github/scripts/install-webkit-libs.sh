#!/usr/bin/env bash
# Installs the system libraries Playwright's WebKit needs.
#
# Fast path: ~/.cache/webkit-libs/snapshot.tar.zst holds every file a previous
# install wrote on this runner image, triggers' output (linker and font
# caches, dpkg's status) included, so one tar restores it in seconds. dpkg
# takes 25-30 s to unpack the same 185 packages.
#
# Otherwise it installs them through `playwright install-deps`, from the .deb
# files in ~/.cache/webkit-packages where the cache has them, and leaves a
# marker for snapshot-webkit-libs.sh, which main runs after the tests. Runs
# before `pnpm install`, so it runs the Playwright version from the lockfile
# (PLAYWRIGHT_VERSION) through npx.
set -euo pipefail

# An empty version would make npx install the latest Playwright, whose
# libraries may not match the browsers the tests run
: "${PLAYWRIGHT_VERSION:?not found in pnpm-lock.yaml}"

snapshot=~/.cache/webkit-libs/snapshot.tar.zst
if [[ -f "$snapshot" ]]; then
  sudo tar --zstd -xpf "$snapshot" -C /
  sudo ldconfig
  echo "Restored WebKit's system libraries from the snapshot"
  exit 0
fi

marker="$RUNNER_TEMP/webkit-libs.marker"
touch "$marker"
sleep 1 # so files written below are strictly newer than the marker

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
