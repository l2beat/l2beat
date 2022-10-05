/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.withSchema('transactions').renameTable('rpc', 'block')
  await knex.raw(
    'ALTER INDEX transactions.transaction_count_pkey RENAME TO block_pkey',
  )
  await knex.raw(
    'ALTER INDEX transactions.starkex_transaction_count_pkey RENAME TO starkex_pkey',
  )
}

export async function down(knex: Knex) {
  await knex.schema.withSchema('transactions').renameTable('block', 'rpc')
  await knex.raw(
    'ALTER INDEX transactions.block_pkey RENAME TO transaction_count_pkey',
  )
  await knex.raw(
    'ALTER INDEX transactions.starkex_pkey RENAME TO starkex_transaction_count_pkey',
  )
}
