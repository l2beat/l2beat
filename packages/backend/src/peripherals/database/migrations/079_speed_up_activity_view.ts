/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const timestampIndexName = 'activity_daily_count_view_timestamp_index'
const projectTimestampIndexName =
  'activity_daily_count_view_project_timestamp_index'
const materializedViewName = 'activity.daily_count_view'

export async function up(knex: Knex) {
  await knex.schema.raw(
    ` CREATE INDEX IF NOT EXISTS ${timestampIndexName} ON ${materializedViewName} (unix_timestamp);`,
  )
  await knex.schema.raw(
    `CREATE INDEX IF NOT EXISTS ${projectTimestampIndexName} ON ${materializedViewName} (project_id, unix_timestamp);`,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw(`DROP INDEX IF EXISTS ${timestampIndexName}`)
  await knex.schema.raw(`DROP INDEX IF EXISTS ${projectTimestampIndexName}`)
}
