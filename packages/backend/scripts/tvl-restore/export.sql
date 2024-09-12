-- To run it login via psql and then type: \i export.sql 
\copy "IndexerState" TO './data/indexer_state.csv' CSV;
\copy "IndexerConfiguration" TO './data/indexer_configurations.csv' CSV;
\copy "BlockTimestamp" TO './data/block_timestamps.csv' CSV;
\copy "Amount" TO './data/amounts.csv' CSV;
\copy "Price" TO './data/prices.csv' CSV;
\copy "Value" TO './data/values.csv' CSV;