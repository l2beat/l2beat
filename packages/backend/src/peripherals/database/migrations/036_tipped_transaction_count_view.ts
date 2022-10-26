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
  await knex.schema.raw(`
  CREATE MATERIALIZED VIEW transactions.block_count_view AS
    SELECT
      block.project_id,
      date_trunc('day', block.unix_timestamp) unix_timestamp,
      sum(block.count) count
    FROM transactions.block block
    INNER JOIN transactions.block_tip tip ON block.project_id = tip.project_id
    WHERE block.unix_timestamp < date_trunc('day', tip.unix_timestamp)
    GROUP BY block.project_id, date_trunc('day', block.unix_timestamp)
  `)
}

export async function down(knex: Knex) {
  await knex.schema.raw('DROP MATERIALIZED VIEW transactions.block_count_view')
  await oldView.up(knex)
}
