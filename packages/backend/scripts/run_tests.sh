#!/bin/bash
source .env

if [ -n "$TEST_DB_URL" ]; then
    export PRISMA_DB_URL=$TEST_DB_URL && pnpm db:migrate && mocha --timeout 10000 $@
else
    mocha --timeout 10000 $@
fi
