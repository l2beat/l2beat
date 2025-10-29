#!/bin/bash

source .env

FEATURES_NAMES=("da" "liveness" "tvs" "activity" "shared" "interop")
FEATURES_TABLES=(
    "IndexerState IndexerConfiguration DataAvailability Blob SyncMetadata"
    "IndexerState IndexerConfiguration"
    "IndexerState IndexerConfiguration TvsBlockTimestamp TvsPrice TvsAmount TokenValue ProjectValue SyncMetadata"
    "IndexerState IndexerConfiguration Activity SyncMetadata"
    "IndexerState IndexerConfiguration AnomalyStats RealTimeLiveness RealTimeAnomaly"
    "IndexerState IndexerConfiguration InteropEvent InteropMessage InteropTransfer"
)

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
  pg_restore -d "$DEV_LOCAL_DB_URL" "./db.pgdump"
}

if [ -z "$1" ]; then
  echo "Usage: ./db-restore <FEATURE>"
  echo "Available features: ${FEATURES_NAMES[*]}"
  exit 1
fi

FEATURE="$1"

FEATURE_INDEX=-1
for i in "${!FEATURES_NAMES[@]}"; do
  if [ "${FEATURES_NAMES[$i]}" = "$FEATURE" ]; then
    FEATURE_INDEX=$i
    break
  fi
done

if [ "$FEATURE_INDEX" -eq -1 ]; then
  echo "Error: Feature '$FEATURE' not found."
  echo "Available features: ${FEATURES_NAMES[*]}"
  exit 1
fi

TABLES=(${FEATURES_TABLES[$FEATURE_INDEX]})

clear_tables "${TABLES[@]}"

echo "Migrating DB to latest"
PRISMA_DB_URL="$DEV_LOCAL_DB_URL" pnpm prisma migrate deploy

dump_tables "${TABLES[@]}"

restore_tables

echo "Removing dump"
rm db.pgdump

echo "✅ DB data restored for feature '$FEATURE'"
