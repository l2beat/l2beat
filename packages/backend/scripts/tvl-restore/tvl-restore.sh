#!/bin/bash

source .env &&

echo "Setting up data folder" &&
rm -rf data 2>/dev/null && 
mkdir data &&

echo "Clearing local TVL tables" &&
psql $DEV_LOCAL_DB_URL -f reset-local.sql &&

echo "Migrating DB to latest" &&
node -r yarn db:migrate &&

echo "Fetching TVL tables from remote DB" &&
psql $DEV_REMOTE_DB_URL_READ_ONLY -f export.sql &&

echo "Restoring TVL tables" &&
psql $DEV_LOCAL_DB_URL -f import.sql &&

echo "Removing data folder" &&
rm -rf data &&

echo "✅ TVL data restored"
