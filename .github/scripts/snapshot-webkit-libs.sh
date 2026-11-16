#!/usr/bin/env bash
# Snapshots every file install-webkit-libs.sh's install wrote, for the next
# run to restore with one tar. Main runs it after the tests: building it
# takes ~2 min, too long to hold the tests up for.
set -euo pipefail

marker="$RUNNER_TEMP/webkit-libs.marker"
snapshot=~/.cache/webkit-libs/snapshot.tar.zst
list="$RUNNER_TEMP/webkit-libs.txt"

# -cnewer, not -newer: dpkg keeps each file's packaged mtime, but unpacking
# sets its ctime. dpkg writes under /usr, /etc and /var only.
sudo find /usr /etc /var -xdev \
  \( -path /var/log -o -path /var/cache/apt -o -path /var/lib/apt/lists \
  -o -path /var/tmp \) -prune \
  -o -cnewer "$marker" \( -type f -o -type l \) -print > "$list"
mkdir -p "$(dirname "$snapshot")"
sudo tar --zstd -cpf "$snapshot" -T "$list"
sudo chown "$USER" "$snapshot"
echo "Snapshot: $(wc -l < "$list") files, $(du -h "$snapshot" | cut -f1)"
