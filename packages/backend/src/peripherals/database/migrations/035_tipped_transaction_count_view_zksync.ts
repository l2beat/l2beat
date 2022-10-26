/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

import * as oldView from './032_transaction_count_view_zksync'

export async function up(knex: Knex) {
  await oldView.down(knex)
  await knex.schema.raw(
    `
    CREATE MATERIALIZED VIEW transactions.zksync_count_view AS
      SELECT
        date_trunc('day', zksync.unix_timestamp) unix_timestamp,
        count(*) count
      FROM transactions.zksync zksync
      INNER JOIN transactions.zksync_tip tip ON zksync.unix_timestamp < date_trunc('day', tip.unix_timestamp)
      GROUP BY date_trunc('day', zksync.unix_timestamp)
  `,
  )
}

export async function down(knex: Knex) {
  await knex.schema.raw('DROP MATERIALIZED VIEW transactions.zksync_count_view')
  await oldView.up(knex)
}
