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
  await knex.schema
    .withSchema('transactions')
    .createMaterializedView('zksync_count_view', function (view) {
      view.columns(['unix_timestamp', 'count'])
      view.as(
        knex
          .withSchema('transactions')
          .select(
            knex.raw(`
            date_trunc('day', unix_timestamp) as unix_timestamp,
            count(*) as count
            `),
          )
          .from('zksync')
          .where(
            'unix_timestamp',
            '<=',
            knex.raw(
              "(SELECT coalesce(min(unix_timestamp) - interval '24 hour', '1900-01-01 00:00:00+00'::timestamptz) FROM transactions.block_tip)",
            ),
          )
          .groupByRaw("date_trunc('day', unix_timestamp)"),
      )
    })
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('transactions')
    .dropMaterializedView('zksync_count_view')
  await oldView.up(knex)
}
