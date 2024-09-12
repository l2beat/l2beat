source .env 

echo "indexer_state..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t indexer_state -a -F c -f "./data/indexer_state.pgdump"

echo "indexer_configurations..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t indexer_configurations -a -F c -f "./data/indexer_configurations.pgdump"

echo "block_timestamps..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t block_timestamps -a -F c -f "./data/block_timestamps.pgdump"

echo "amounts..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t amounts -a -F c -f "./data/amounts.pgdump"

echo "prices..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t prices -a -F c -f "./data/prices.pgdump"

echo "values..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t values -a -F c -f "./data/values.pgdump"
