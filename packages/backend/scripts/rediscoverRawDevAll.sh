#!/bin/bash

set -e

# Base directory containing the discovery projects
BASE_DIR="discovery"

# Optional project to start from
START_PROJECT=$1

# Variable to track if the start project has been found
start_found=false

# Iterate through each project folder in the base directory
for project in "$BASE_DIR"/*; do
    # Check if the project is a directory and does not start with an underscore
    if [[ -d "$project" && $(basename "$project") != _* ]]; then
        # Get the project name
        project_name=$(basename "$project")

        # If a start project is specified, check if we've reached it yet
        if [[ -n "$START_PROJECT" && "$start_found" == false ]]; then
            if [[ "$project_name" == "$START_PROJECT" ]]; then
                start_found=true
            else
                continue
            fi
        fi

        # Iterate through each chain folder inside the project folder
        for chain in "$project"/*; do
            # Check if the chain is a directory
            if [[ -d "$chain" && $(basename "$chain") != "bsc" ]]; then
                # Get the chain name
                chain_name=$(basename "$chain")

                # Run the yarn discover command
                echo "Running: yarn discover:raw $chain_name $project_name --dev"
                yarn discover:raw "$chain_name" "$project_name" --dev
            fi
        done
    fi
done
