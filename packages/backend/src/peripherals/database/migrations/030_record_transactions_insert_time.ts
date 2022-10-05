/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const makeAddInsertAt =
  (knex: Knex) =>
  (table: Knex.CreateTableBuilder): void => {
    table.dateTime('inserted_at').defaultTo(knex.fn.now())
  }
const dropInsertAt = (table: Knex.CreateTableBuilder): void => {
  table.dropColumn('inserted_at')
}

export async function up(knex: Knex) {
  const addInsertAt = makeAddInsertAt(knex)
  await knex.schema
    .withSchema('transactions')
    .alterTable('block', addInsertAt)
    .alterTable('starkex', addInsertAt)
    .alterTable('zksync', addInsertAt)
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('transactions')
    .alterTable('block', dropInsertAt)
    .alterTable('starkex', dropInsertAt)
    .alterTable('zksync', dropInsertAt)
}
