source .env

echo "Dumping tables IndexerState, IndexerConfiguration, BlockTimestamp, Amount, Price, and Value..."
pg_dump -d "$DEV_REMOTE_DB_URL_READ_ONLY" -t \"IndexerState\" -t \"IndexerConfiguration\" -t \"BlockTimestamp\" -t \"Amount\" -t \"Price\" -t \"Value\" -a -F c -f "./data/all_tables.pgdump"
