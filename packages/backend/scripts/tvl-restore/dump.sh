source .env 

echo "IndexerState..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"IndexerState\" -a -f "./data/indexer.sql"

echo "IndexerConfiguration..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t "\"IndexerConfiguration\"" -a -f "./data/configuration.sql"

echo "BlockTimestamp..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t "\"BlockTimestamp\"" -a -f "./data/block.sql"

echo "Amount..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t "\"Amount\"" -a -f "./data/amount.sql"

echo "Price..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t "\"Price\"" -a -f "./data/price.sql"

echo "Value..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t "\"Value\"" -a -f "./data/value.sql"
