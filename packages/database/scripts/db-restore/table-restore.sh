#!/bin/bash

source .env

clear_tables() {
  local tables=("$@")
  local table_name
  local quoted_tables=""

  echo "Clearing local tables: ${tables[*]}"

  # This is needed for case-sensitive tables
  for table_name in "${tables[@]}"; do
    quoted_tables+=" '$table_name',"
  done
  # Remove the trailing comma
  quoted_tables="${quoted_tables%,}"

  psql "$DEV_LOCAL_DB_URL" -c "
DO \$\$
DECLARE
    tables TEXT[] := ARRAY[$quoted_tables];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = table_name) THEN
            EXECUTE format('DELETE FROM %I', table_name);
        END IF;
    END LOOP;
END \$\$;
"
}

dump_tables() {
  local tables=("$@")
  local table_args=""
  local table_name

  for table_name in "${tables[@]}"; do
    table_args+=" -t \"$table_name\""
  done

  echo "Dumping tables from remote: ${tables[*]} (this may take a while)..."
  pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" $table_args -a -F c -f "./db.pgdump"
}

restore_tables() {
  echo "Restoring tables (this may take a while)..."
  pg_restore -d "$DEV_LOCAL_DB_URL" "./db.pgdump" --verbose
}

if [ -z "$1" ]; then
  echo "Usage: ./table-restore.sh <TABLE_NAME> [TABLE_NAME2] [TABLE_NAME3] ..."
  echo "Example: ./table-restore.sh IndexerState"
  echo "Example: ./table-restore.sh IndexerState IndexerConfiguration"
  exit 1
fi

TABLES=("$@")

echo "Restoring tables: ${TABLES[*]}"

clear_tables "${TABLES[@]}"

echo "Migrating DB to latest"
PRISMA_DB_URL="$DEV_LOCAL_DB_URL" pnpm prisma migrate deploy

dump_tables "${TABLES[@]}"

restore_tables

echo "Removing dump"
rm db.pgdump

echo "✅ DB data restored for tables: ${TABLES[*]}"
