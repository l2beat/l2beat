/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const startOfDay = `date_trunc('day', unix_timestamp)`

export async function up(knex: Knex) {
  await knex.schema.raw(
    `
    CREATE MATERIALIZED VIEW transactions.daily_count_view AS
      SELECT 'zksync' as project_id, ${startOfDay} unix_timestamp, count(*) count
      FROM transactions.zksync
      GROUP BY ${startOfDay}
      UNION
      SELECT project_id, ${startOfDay} unix_timestamp, sum(count) count
      FROM transactions.block
      GROUP BY ${startOfDay}, project_id
      UNION
      SELECT project_id, unix_timestamp, count FROM transactions.starkex
  `,
  )
  await knex.schema.raw(
    `CREATE UNIQUE INDEX daily_count_view_unique_idx ON transactions.daily_count_view (project_id, unix_timestamp)`,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw(`DROP MATERIALIZED VIEW transactions.daily_count_view`)
}
