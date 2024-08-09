echo "Setting up data folder"
rm -rf data 2>/dev/null && mkdir data

echo "Fetching data from remote DB"
psql $DEV_REMOTE_DB_URL_READ_ONLY -f export.sql

echo "Resetting local DB"
psql $DEV_LOCAL_DB_URL -f reset-local.sql

echo "Migrating DB to latest"
node -r esbuild-register migrateDb.ts

echo "Restoring tables"
psql $DEV_LOCAL_DB_URL -f import.sql

echo "Removing data folder"
rm -rf data
