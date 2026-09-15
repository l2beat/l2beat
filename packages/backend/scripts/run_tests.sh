#!/usr/bin/env bash
source .env

if [ -n "$TEST_DB_URL" ]; then
    # Package test suites run in parallel against a single Postgres server, so each
    # one gets its own schema. Sharing "public" lets suites truncate each other's rows.
    SCHEMA=backend_test
    export PRISMA_DB_URL="$TEST_DB_URL?schema=$SCHEMA"
    export TEST_DB_URL="$TEST_DB_URL?options=-c%20search_path%3D$SCHEMA"
    pnpm db:migrate && mocha --timeout 10000 $@
else
    mocha --timeout 10000 $@
fi
