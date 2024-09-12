#!/bin/bash

source .env &&

echo "Setting up data folder" &&
rm -rf data 2>/dev/null && 
mkdir data &&

echo "Clearing local TVL tables" &&
BASE_DB_URL="${DEV_LOCAL_DB_URL%/*}"
psql $BASE_DB_URL -c "DROP DATABASE IF EXISTS l2beat_local" -c "CREATE DATABASE l2beat_local"

echo "Migrating DB to latest" &&
PRISMA_DB_URL=$PRISMA_DB_URL yarn prisma migrate deploy &&

echo "Fetching TVL tables from remote DB" &&
./export.sh &&

echo "Restoring TVL tables" &&
./import.sh &&

echo "Removing data folder" &&
rm -rf data &&

echo "✅ TVL data restored"
