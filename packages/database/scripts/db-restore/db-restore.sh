#!/usr/bin/env bash

set -euo pipefail

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
  local columns

  for table_name in "${tables[@]}"; do
    echo "Copying \"$table_name\" since $since (this may take a while)..."
    # Use the remote column list on both sides so the copy still works when
    # local migrations added columns the remote does not have yet
    columns=$(psql "$DEV_REMOTE_DB_URL_READ_ONLY" -tAc "
      SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = '$table_name'
    ")
    psql "$DEV_REMOTE_DB_URL_READ_ONLY" -c "\copy (SELECT $columns FROM \"$table_name\" WHERE \"timestamp\" >= '$since') TO './$table_name.copy'"
    psql "$DEV_LOCAL_DB_URL" -c "\copy \"$table_name\" ($columns) FROM './$table_name.copy'"
    rm "./$table_name.copy"
    sync_sequences "$table_name"
  done
}

# COPY writes explicit ID values without advancing the owned sequences
# (pg_restore did that via sequence-set data), so bump them to the copied
# maximum to avoid uniqueness violations on future local inserts
sync_sequences() {
  local table_name="$1"

  psql "$DEV_LOCAL_DB_URL" -q -c "
DO \$\$
DECLARE
    col RECORD;
    max_val BIGINT;
BEGIN
    FOR col IN
        SELECT a.attname, pg_get_serial_sequence('\"$table_name\"', a.attname) AS seq
        FROM pg_attribute a
        WHERE a.attrelid = '\"$table_name\"'::regclass
          AND a.attnum > 0
          AND NOT a.attisdropped
          AND pg_get_serial_sequence('\"$table_name\"', a.attname) IS NOT NULL
    LOOP
        EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM %I', col.attname, '$table_name') INTO max_val;
        IF max_val > 0 THEN
            PERFORM setval(col.seq, max_val);
        END IF;
    END LOOP;
END \$\$;
"
}

if [ -z "${1:-}" ]; then
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

# Fail on an invalid cutoff before any local data is wiped
if [ -n "$SINCE" ]; then
  if ! psql "$DEV_LOCAL_DB_URL" -tAc "SELECT 1" > /dev/null 2>&1; then
    echo "Error: cannot connect to the local database (DEV_LOCAL_DB_URL). Is it running?"
    exit 1
  fi
  if ! psql "$DEV_LOCAL_DB_URL" -tAc "SELECT '$SINCE'::timestamp" > /dev/null 2>&1; then
    echo "Error: SINCE value '$SINCE' is not a valid timestamp."
    exit 1
  fi
fi

clear_tables "${TABLES[@]}"

echo "Migrating DB to latest"
PRISMA_DB_URL="$DEV_LOCAL_DB_URL" pnpm prisma migrate deploy

if [ -n "$SINCE" ]; then
  # Versioned state tables where the latest row per key must survive the
  # cutoff (e.g. InteropConfig, read via latest-per-key) — always copy in full
  FULL_COPY_OVERRIDES=("InteropConfig")

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
    if printf '%s\n' "${FULL_COPY_OVERRIDES[@]}" | grep -qx "$table_name"; then
      FULL_TABLES+=("$table_name")
    elif grep -qx "$table_name" <<< "$TIMESTAMPED"; then
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

  if [ "${#SINCE_TABLES[@]}" -gt 0 ]; then
    copy_tables_since "$SINCE" "${SINCE_TABLES[@]}"
  fi

  echo "✅ DB data restored for feature '$FEATURE' (since $SINCE)"
else
  dump_tables "${TABLES[@]}"

  restore_tables

  echo "Removing dump"
  rm db.pgdump

  echo "✅ DB data restored for feature '$FEATURE'"
fi
