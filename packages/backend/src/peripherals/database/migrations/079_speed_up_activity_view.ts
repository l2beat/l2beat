/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const indexName = 'activity_daily_count_view_timestamp_index'
const materializedViewName = 'activity.daily_count_view'

export async function up(knex: Knex) {
  await knex.schema.raw(
    ` CREATE INDEX IF NOT EXISTS ${indexName} ON ${materializedViewName} (unix_timestamp);`,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw(`DROP INDEX IF EXISTS ${indexName}`)
}
