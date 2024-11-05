#!/bin/bash
source .env &&

echo "Clearing local TVL tables" &&
psql $DEV_LOCAL_DB_URL -f clear-tvl.sql &&

echo "Migrating DB to latest" &&
PRISMA_DB_URL=$PRISMA_DB_URL pnpm prisma migrate deploy &&

echo "Dumping TVL tables from remote (this may take a while)..." &&
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"IndexerState\" -t \"IndexerConfiguration\" -t \"BlockTimestamp\" -t \"Amount\" -t \"Price\" -t \"Value\" -a -F c -f "./tvl.pgdump"

echo "Restoring TVL tables (this may take a while)..." &&
pg_restore -d $DEV_LOCAL_DB_URL "./tvl.pgdump"

echo "Removing dump" &&
rm tvl.pgdump &&

echo "✅ TVL data restored"
