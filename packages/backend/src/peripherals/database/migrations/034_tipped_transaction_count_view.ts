/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

import * as oldView from './030_transaction_count_view'

export async function up(knex: Knex) {
  await oldView.down(knex)
  await knex.schema
    .withSchema('transactions')
    .createMaterializedView('block_count_view', function (view) {
      view.columns(['project_id', 'unix_timestamp', 'count'])
      view.as(
        knex
          .withSchema('transactions')
          .select(
            knex.raw(`
              project_id, 
              date_trunc('day', unix_timestamp) as unix_timestamp,
              sum(count) as count
              `),
          )
          .from('block')
          .where(
            'unix_timestamp',
            '<=',
            knex.raw(
              "(SELECT coalesce(min(unix_timestamp) - interval '24 hour', '1900-01-01 00:00:00+00'::timestamptz) FROM transactions.block_tip)",
            ),
          )
          .groupByRaw("project_id, date_trunc('day', unix_timestamp)"),
      )
    })
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('transactions')
    .dropMaterializedView('block_count_view')
  await oldView.up(knex)
}
