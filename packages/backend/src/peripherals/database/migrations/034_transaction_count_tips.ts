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
    .createTable('block_tip', function (table) {
      table.string('project_id').primary()
      table.dateTime('unix_timestamp').notNullable()
      table.integer('block_number').notNullable()
      table.integer('count').notNullable()
    })
    .createTable('zksync_tip', function (table) {
      table.dateTime('unix_timestamp').notNullable()
      table.integer('block_number').notNullable()
      table.integer('block_index').notNullable()
    })
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('transactions')
    .dropTable('block_tip')
    .dropTable('zksync_tip')
}
