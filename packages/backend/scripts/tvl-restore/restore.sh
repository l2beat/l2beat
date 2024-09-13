source .env 

echo "IndexerState..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/indexer.pgdump"

echo "IndexerConfiguration..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/configuration.pgdump"

echo "BlockTimestamp..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/block.pgdump"

echo "Amount..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/amount.pgdump"

echo "Price..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/price.pgdump"

echo "Value..."
pg_restore -d $DEV_LOCAL_DB_URL "./data/value.pgdump"