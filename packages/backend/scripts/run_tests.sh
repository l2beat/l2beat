#!/usr/bin/env bash
source .env

if [ -n "$TEST_DB_URL" ]; then
    # Package test suites and worktrees run in parallel against a single Postgres
    # server, so each gets its own schema. See scripts/test_db_schema.sh.
    SCHEMA="$(../../scripts/test_db_schema.sh backend)"
    export PRISMA_DB_URL="$TEST_DB_URL?schema=$SCHEMA"
    export TEST_DB_URL="$TEST_DB_URL?options=-c%20search_path%3D$SCHEMA"
    pnpm db:migrate && mocha --timeout 10000 $@
else
    mocha --timeout 10000 $@
fi
