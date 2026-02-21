#!/bin/bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: $0 <DATABASE_URL> [OUTPUT_DIR]"
  echo "Example: $0 \"postgresql://user:pass@host:5432/db\" ./db-snapshot-old"
  exit 1
fi

DATABASE_URL="$1"
OUTPUT_DIR="${2:-./db-snapshot-$(date +%Y%m%d-%H%M%S)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/snapshot.sql"

mkdir -p "$OUTPUT_DIR"

echo "Running DB snapshot queries into: $OUTPUT_DIR"

(
  cd "$OUTPUT_DIR"
  psql "$DATABASE_URL" \
    -X \
    -v ON_ERROR_STOP=1 \
    -f "$SQL_FILE"
)

echo "Running schema dumps..."
pg_dump \
  --dbname="$DATABASE_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT_DIR/90_schema.sql"

pg_dump \
  --dbname="$DATABASE_URL" \
  --schema-only \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT_DIR/91_schema.dump"

echo "Attempting globals dump (roles/tablespaces)..."
if pg_dumpall --globals-only --dbname="$DATABASE_URL" > "$OUTPUT_DIR/92_globals.sql" 2>"$OUTPUT_DIR/92_globals.stderr.log"; then
  echo "Globals dump succeeded."
else
  echo "Globals dump failed (often permissions-related). See 92_globals.stderr.log"
fi

cat > "$OUTPUT_DIR/00_manifest.txt" <<EOF
collected_at_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
database_url_redacted=$(echo "$DATABASE_URL" | sed -E 's#(://[^:]+:)[^@]+@#\1***@#')
sql_file=$SQL_FILE
EOF

echo "Done."
echo "Snapshot folder: $OUTPUT_DIR"
