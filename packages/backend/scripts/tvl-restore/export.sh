source .env 

echo "IndexerState..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t IndexerState -a -F c -f "./data/indexer_state.pgdump"

echo "IndexerConfiguration..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t IndexerConfiguration -a -F c -f "./data/indexer_configurations.pgdump"

echo "BlockTimestamp..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t BlockTimestamp -a -F c -f "./data/block_timestamps.pgdump"

echo "Amount..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t Amount -a -F c -f "./data/amounts.pgdump"

echo "Price..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t Price -a -F c -f "./data/prices.pgdump"

echo "Value..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t Value -a -F c -f "./data/values.pgdump"
