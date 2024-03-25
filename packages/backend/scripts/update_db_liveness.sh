#!/usr/bin/env bash

# this script is used to download the latest database dump from the staging server
# and load it into the local database to improve the local development experience

# right now it replaces the tracked_txs_configs, indexer_state and liveness tables

# Check if the Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Error: Heroku CLI is not installed."
    exit 1
fi

# Check if the PostgreSQL utilities are installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL utilities (psql) are not installed."
    exit 1
fi

# function that downloads the latest database dump from the staging server
function download_dump() {
        echo "Logging into psql..."
        echo "Downloading the tracked_txs_configs table to a csv file..."
        heroku psql --app l2beat-staging -c "\copy tracked_txs_configs TO 'txs_conf.csv' CSV"
        echo "Downloading the indexer_state table to a csv file..."
        heroku psql --app l2beat-staging -c "\copy indexer_state to 'index.csv' CSV"
        echo "Downloading the liveness table to a csv file. This can take few minutes..."
        heroku psql --app l2beat-staging -c "\copy liveness to 'liveness.csv' CSV"
        echo "Downloading the l2_costs table to a csv file. This can take few minutes..."
        heroku psql --app l2beat-staging -c "\copy l2_costs to 'l2_costs.csv' CSV"
        echo "Downloading the finality table to a csv file. This can take few minutes..."
        heroku psql --app l2beat-staging -c "\copy finality to 'finality.csv' CSV"
}

# Get the current timestamp
TIMESTAMP=$(date +%s)


# move to .db directory, create if not exists
cd cache
mkdir -p .db
cd .db

# Use command substitution to assign the list of directory names to a variable
directory_names=$(find . -mindepth 1 -maxdepth 1 -type d -exec basename {} \;)

# If you want to see the names stored in the variable, you can echo it
echo "$directory_names"

# check of directory names is empty
if [[ -z "$directory_names" ]]; then
    echo "No directories found."
    mkdir -p "$TIMESTAMP"
    cd "$TIMESTAMP"

    download_dump
else
    echo "Directories found."
    # Use the sort command to sort the directory names in reverse order
    LATEST_DIRECTORY=$(echo "$directory_names" | sort -r | head -n 1)
    # remove all not latest directories
    for directory in $directory_names; do
        if [[ $directory != $LATEST_DIRECTORY ]]; then
            echo "Removing old $directory..."
            rm -r "$directory"
        fi
    done

    echo "Latest directory found: $LATEST_DIRECTORY"
    # the name of the directory is the date of the dump
    LATEST_TIMESTAMP=$(basename "$LATEST_DIRECTORY")
    # get the difference in seconds
    DIFFERENCE=$((TIMESTAMP - LATEST_TIMESTAMP))
    # if the difference is greater than two days (172800 seconds), drop the directory
    if [[ $DIFFERENCE -gt 172800 ]]; then
        echo "The latest directory is older than two days."
        echo "Removing old $LATEST_DIRECTORY..."
        rm -r "$LATEST_DIRECTORY"


        mkdir -p "$TIMESTAMP"
        cd "$TIMESTAMP"

        download_dump
    else
        echo "Latest directory is not older than two days. Using the local files."
        cd "$LATEST_DIRECTORY"
    fi
fi

# restore the files 'txs_conf.csv', 'liveness.csv' and 'index.csv' to the local database

echo "Restoring the tracked_txs_configs table from the csv file..."
psql -d l2beat_local -c "DELETE FROM tracked_txs_configs;"
psql -d l2beat_local -c "\copy tracked_txs_configs FROM 'txs_conf.csv' DELIMITER ',' CSV;"
echo "Restoring the indexer_state table from the csv file..."
psql -d l2beat_local -c "DELETE FROM indexer_state;"
psql -d l2beat_local -c "\copy indexer_state FROM 'index.csv' DELIMITER ',' CSV;"
echo "Restoring the liveness table from the csv file..."
psql -d l2beat_local -c "DELETE FROM liveness;"
psql -d l2beat_local -c "\copy liveness FROM 'liveness.csv' DELIMITER ',' CSV;"
echo "Restoring the l2_costs table from the csv file..."
psql -d l2beat_local -c "DELETE FROM l2_costs;"
psql -d l2beat_local -c "\copy l2_costs FROM 'l2_costs.csv' DELIMITER ',' CSV;"
echo "Restoring the finality table from the csv file..."
psql -d l2beat_local -c "DELETE FROM finality;"
psql -d l2beat_local -c "\copy finality FROM 'finality.csv' DELIMITER ',' CSV;"

echo "Database restored successfully."