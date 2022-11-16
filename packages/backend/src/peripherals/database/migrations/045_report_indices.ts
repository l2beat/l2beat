/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const sixHourlyIndex = 'reports_unix_timestamp_six_hourly_index'
const dailyIndex = 'reports_unix_timestamp_daily_index'
const drop = (name: string) => `drop index ${name}`

export async function up(knex: Knex) {
  await knex.schema.raw(
    `create index if not exists ${sixHourlyIndex}
     on reports (unix_timestamp, project_id, asset_id) where extract(hour from unix_timestamp) % 6 = 0`,
  )
  await knex.schema.raw(
    `create index if not exists ${dailyIndex}
     on reports (unix_timestamp, project_id, asset_id) where extract(hour from unix_timestamp) = 0`,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw(drop(sixHourlyIndex))
  await knex.schema.raw(drop(dailyIndex))
}
