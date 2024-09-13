-- To run it login via psql and then type: \i import.sql 
\copy "IndexerState" FROM './data/indexer_state.csv' DELIMITER ',' CSV;
\copy "IndexerConfiguration" FROM './data/indexer_configurations.csv' DELIMITER ',' CSV;
\copy "BlockTimestamp" FROM './data/block_timestamps.csv' DELIMITER ',' CSV;
\copy "Amount" FROM './data/amounts.csv' DELIMITER ',' CSV;
\copy "Price" FROM './data/prices.csv' DELIMITER ',' CSV;
\copy "Value" FROM './data/values.csv' DELIMITER ',' CSV;