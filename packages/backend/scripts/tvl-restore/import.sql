-- To run it login via psql and then type: \i import.sql 
\copy indexer_state FROM './data/indexer_state.csv' DELIMITER ',' CSV;
\copy indexer_configurations FROM './data/indexer_configurations.csv' DELIMITER ',' CSV;
\copy block_timestamps FROM './data/block_timestamps.csv' DELIMITER ',' CSV;
\copy amounts FROM './data/amounts.csv' DELIMITER ',' CSV;
\copy prices FROM './data/prices.csv' DELIMITER ',' CSV;
\copy values FROM './data/values.csv' DELIMITER ',' CSV;