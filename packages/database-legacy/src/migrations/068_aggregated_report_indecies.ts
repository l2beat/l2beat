/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const sixHourlyIndex = 'aggregated_reports_unix_timestamp_six_hourly_index'
const dailyIndex = 'aggregated_reports_unix_timestamp_daily_index'

const SIX_HOURS_IN_SECONDS = 6 * 60 * 60
const ONE_DAY_IN_SECONDS = 24 * 60 * 60

export async function up(knex: Knex) {
  // Old index names
  await knex.schema.raw(
    'DROP INDEX IF EXISTS aggregated_reports_is_daily_index',
  )
  await knex.schema.raw(
    'DROP INDEX IF EXISTS aggregated_reports_is_six_hourly_index',
  )

  await knex.schema.alterTable('aggregated_reports', (table) => {
    table.dropColumn('is_daily')
    table.dropColumn('is_six_hourly')
  })

  await knex.schema.raw(
    `CREATE INDEX IF NOT EXISTS ${sixHourlyIndex}
    on aggregated_reports (unix_timestamp) 
    WHERE
    EXTRACT(hour FROM unix_timestamp) % 6 = 0`,
  )
  await knex.schema.raw(
    `CREATE INDEX IF NOT EXISTS ${dailyIndex}
    on aggregated_reports (unix_timestamp) 
    WHERE
    EXTRACT(hour FROM unix_timestamp) = 0`,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw(`DROP INDEX IF EXISTS ${sixHourlyIndex}`)
  await knex.schema.raw(`DROP INDEX IF EXISTS ${dailyIndex}`)

  await knex.schema.alterTable('aggregated_reports', (table) => {
    table.boolean('is_daily').defaultTo(false).notNullable()
    table.boolean('is_six_hourly').defaultTo(false).notNullable()

    table.index(['is_daily'], 'aggregated_reports_is_daily_index')
    table.index(['is_six_hourly'], 'aggregated_reports_is_six_hourly_index')
  })

  /**
   * Data reverse migration for is_six_hourly and is_daily respectively
   */
  await knex.schema.raw(`
      UPDATE aggregated_reports
      SET is_six_hourly = true
      WHERE
      EXTRACT(epoch FROM unix_timestamp) % ${SIX_HOURS_IN_SECONDS} = 0
      `)

  await knex.schema.raw(`
      UPDATE aggregated_reports
      SET is_daily = true
      WHERE
      EXTRACT(epoch FROM unix_timestamp) % ${ONE_DAY_IN_SECONDS} = 0
      `)
}
