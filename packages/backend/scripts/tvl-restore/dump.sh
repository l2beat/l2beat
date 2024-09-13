source .env 

echo "IndexerState..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"IndexerState\" -a -F c -f "./data/indexer.pgdump"

echo "IndexerConfiguration..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"IndexerConfiguration\" -a -f "./data/configuration.pgdump"

echo "BlockTimestamp..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"BlockTimestamp\" -a -f "./data/block.pgdump"

echo "Amount..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"Amount\" -a -f "./data/amount.pgdump"

echo "Price..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"Price\" -a -f "./data/price.pgdump"

echo "Value..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"Value\" -a -f "./data/value.pgdump"
