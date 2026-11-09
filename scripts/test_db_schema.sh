#!/usr/bin/env bash
# Prints the Postgres schema for a package's tests:
# `test_db_schema.sh backend` -> backend_test_my_worktree_3f2a9c.
#
# Every checkout points TEST_DB_URL at one database. With one schema per
# package, a migration from one worktree's branch breaks the tests in every
# other worktree, and parallel runs truncate each other's rows. A schema per
# checkout stops both.

set -euo pipefail

package="$1"
if ! checkout="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  # Outside a git checkout (e.g. a Docker build) there is only one copy.
  echo "${package}_test"
  exit 0
fi

# The name keeps the schema recognizable in psql; the hash of the full path
# keeps two checkouts with the same directory name apart.
name="$(basename "$checkout" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '_' | cut -c1-30)"
hash="$(printf '%s' "$checkout" | cksum | cut -d' ' -f1 | cut -c1-6)"

echo "${package}_test_${name%_}_${hash}"
