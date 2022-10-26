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
  await knex.schema
    .withSchema('transactions')
    .alterTable('block_tip', function (table) {
      table.setNullable('unix_timestamp')
      table.setNullable('block_number')
      table.dropColumn('count')
    })
}

export async function down(knex: Knex) {
  await knex.raw('DELETE FROM transactions.block_tip')
  await knex.schema
    .withSchema('transactions')
    .alterTable('block_tip', function (table) {
      table.dropNullable('unix_timestamp')
      table.dropNullable('block_number')
      table.integer('count').notNullable()
    })
}
