-- To run it login via psql and then type: \i export.sql 
\copy indexer_state TO './data/indexer_state.csv' CSV;
\copy indexer_configurations TO './data/indexer_configurations.csv' CSV;
\copy block_timestamps TO './data/block_timestamps.csv' CSV;
\copy amounts TO './data/amounts.csv' CSV;
\copy prices TO './data/prices.csv' CSV;
\copy values TO './data/values.csv' CSV;