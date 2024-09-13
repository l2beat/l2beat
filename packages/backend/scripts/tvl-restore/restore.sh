source .env 

echo "IndexerState..."
psql -d $DEV_LOCAL_DB_URL -f "./data/indexer.sql"

echo "IndexerConfiguration..."
psql -d $DEV_LOCAL_DB_URL -f "./data/configuration.sql"

echo "BlockTimestamp..."
psql -d $DEV_LOCAL_DB_URL -f "./data/block.sql"

echo "Amount..."
psql -d $DEV_LOCAL_DB_URL -f "./data/amount.sql"

echo "Price..."
psql -d $DEV_LOCAL_DB_URL -f "./data/price.sql"

echo "Value..."
psql -d $DEV_LOCAL_DB_URL -f "./data/value.sql"