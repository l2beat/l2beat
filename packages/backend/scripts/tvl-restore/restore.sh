source .env 

echo "IndexerState..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/all_tables.pgdump"