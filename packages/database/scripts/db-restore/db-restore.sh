#!/usr/bin/env bash

source .env

FEATURES_NAMES=("da" "liveness" "tvs" "activity" "shared" "interop" "interop-aggregates" "token-db" "tracked-txs" "privacy")
FEATURES_TABLES=(
    "IndexerState IndexerConfiguration DataAvailability Blob SyncMetadata"
    "IndexerState IndexerConfiguration Liveness AggregatedLiveness"
    "IndexerState IndexerConfiguration TvsBlockTimestamp TvsPrice TvsAmount TokenValue SyncMetadata"
    "IndexerState IndexerConfiguration Activity SyncMetadata"
    "IndexerState IndexerConfiguration AnomalyStats RealTimeLiveness RealTimeAnomaly"
    "IndexerState IndexerConfiguration InteropEvent InteropMessage InteropTransfer InteropConfig InteropRecentPrices InteropPluginSyncState InteropPluginSyncedRange"
    "IndexerState IndexerConfiguration AggregatedInteropTransfer AggregatedInteropToken InteropAggregateStatus"
    "AbstractToken DeployedToken TokenRelation Chain TokenDbSettings TokenIngestionQueue TokenDbHistory"
    "IndexerState IndexerConfiguration L2Cost Liveness AggregatedL2Cost AggregatedLiveness"
    "IndexerState IndexerConfiguration PrivacyBlockTimestamp PrivacyFlowEvent PrivacyPrice"
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
    existing_tables TEXT[] := ARRAY[]::TEXT[];
    table_list TEXT;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = table_name) THEN
            existing_tables := array_append(existing_tables, format('%I', table_name));
        END IF;
    END LOOP;

    IF array_length(existing_tables, 1) IS NOT NULL THEN
        table_list := array_to_string(existing_tables, ', ');
        EXECUTE format('TRUNCATE TABLE %s', table_list);
    END IF;
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

# pg_dump cannot filter rows, so tables with a "timestamp" column are copied
# row-by-row with a WHERE clause instead
copy_tables_since() {
  local since="$1"
  shift
  local tables=("$@")
  local table_name

  for table_name in "${tables[@]}"; do
    echo "Copying \"$table_name\" since $since (this may take a while)..."
    psql "$DEV_REMOTE_DB_URL_READ_ONLY" -c "\copy (SELECT * FROM \"$table_name\" WHERE \"timestamp\" >= '$since') TO './$table_name.copy'"
    psql "$DEV_LOCAL_DB_URL" -c "\copy \"$table_name\" FROM './$table_name.copy'"
    rm "./$table_name.copy"
  done
}

if [ -z "$1" ]; then
  echo "Usage: ./db-restore <FEATURE> [SINCE]"
  echo "Available features: ${FEATURES_NAMES[*]}"
  echo "SINCE (optional): only copy rows with \"timestamp\" >= SINCE, e.g. 2026-07-01"
  exit 1
fi

FEATURE="$1"
SINCE="${2:-}"

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

if [ -n "$SINCE" ]; then
  # Split tables by whether they have a "timestamp" column on the remote
  IN_LIST=$(printf "'%s'," "${TABLES[@]}")
  IN_LIST="${IN_LIST%,}"
  TIMESTAMPED=$(psql "$DEV_REMOTE_DB_URL_READ_ONLY" -tAc "
    SELECT table_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'timestamp' AND table_name IN ($IN_LIST)
  ")

  FULL_TABLES=()
  SINCE_TABLES=()
  for table_name in "${TABLES[@]}"; do
    if grep -qx "$table_name" <<< "$TIMESTAMPED"; then
      SINCE_TABLES+=("$table_name")
    else
      FULL_TABLES+=("$table_name")
    fi
  done

  if [ "${#FULL_TABLES[@]}" -gt 0 ]; then
    dump_tables "${FULL_TABLES[@]}"
    restore_tables
    echo "Removing dump"
    rm db.pgdump
  fi

  copy_tables_since "$SINCE" "${SINCE_TABLES[@]}"

  echo "✅ DB data restored for feature '$FEATURE' (since $SINCE)"
else
  dump_tables "${TABLES[@]}"

  restore_tables

  echo "Removing dump"
  rm db.pgdump

  echo "✅ DB data restored for feature '$FEATURE'"
fi
