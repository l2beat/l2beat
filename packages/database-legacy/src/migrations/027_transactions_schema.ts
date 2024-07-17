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
  await knex.schema.createSchema('transactions')
  await knex.raw('ALTER TABLE transaction_count SET SCHEMA transactions')
  await knex.schema
    .withSchema('transactions')
    .renameTable('transaction_count', 'rpc')

  await knex.raw(
    'ALTER TABLE starkex_transaction_count SET SCHEMA transactions',
  )
  await knex.schema
    .withSchema('transactions')
    .renameTable('starkex_transaction_count', 'starkex')
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('transactions')
    .renameTable('rpc', 'transaction_count')
  await knex.raw('ALTER TABLE transactions.transaction_count SET SCHEMA public')

  await knex.schema
    .withSchema('transactions')
    .renameTable('starkex', 'starkex_transaction_count')
  await knex.raw(
    'ALTER TABLE transactions.starkex_transaction_count SET SCHEMA public',
  )

  await knex.schema.dropSchema('transactions')
}
