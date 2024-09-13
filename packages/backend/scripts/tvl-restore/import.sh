source .env 

echo "IndexerState..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"IndexerState\"" "./data/indexer_state.pgdump"

echo "IndexerConfiguration..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"IndexerConfiguration\"" "./data/indexer_configurations.pgdump"

echo "BlockTimestamp..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"BlockTimestamp\"" "./data/block_timestamps.pgdump"

echo "Amount..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"Amount\"" "./data/amounts.pgdump"

echo "Price..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"Price\"" "./data/prices.pgdump"

echo "Value..."
pg_restore -d $DEV_LOCAL_DB_URL -t "\"Value\"" "./data/values.pgdump"