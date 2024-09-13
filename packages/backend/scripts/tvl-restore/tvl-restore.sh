#!/bin/bash

source .env &&

echo "Setting up data folder" &&
rm -rf data 2>/dev/null && 
mkdir data &&

echo "Clearing local TVL tables" &&
psql $DEV_LOCAL_DB_URL -f reset-local.sql &&

echo "Migrating DB to latest" &&
PRISMA_DB_URL=$PRISMA_DB_URL yarn prisma migrate deploy &&

echo "Fetching TVL tables from remote DB" &&
./dump.sh &&

echo "Restoring TVL tables" &&
./restore.sh &&

echo "Removing data folder" &&
rm -rf data &&

echo "✅ TVL data restored"
