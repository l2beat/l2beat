source .env 

echo "indexer_state..."
pg_restore -d $DEV_LOCAL_DB_URL -t indexer_state "./data/indexer_state.pgdump"

echo "indexer_configurations..."
pg_restore -d $DEV_LOCAL_DB_URL -t indexer_configurations "./data/indexer_configurations.pgdump"

echo "block_timestamps..."
pg_restore -d $DEV_LOCAL_DB_URL -t block_timestamps "./data/block_timestamps.pgdump"

echo "amounts..."
pg_restore -d $DEV_LOCAL_DB_URL -t amounts "./data/amounts.pgdump"

echo "prices..."
pg_restore -d $DEV_LOCAL_DB_URL -t prices "./data/prices.pgdump"

echo "values..."
pg_restore -d $DEV_LOCAL_DB_URL -t values "./data/values.pgdump"