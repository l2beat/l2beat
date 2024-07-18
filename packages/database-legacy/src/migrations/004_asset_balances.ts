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
  await knex.schema.createTable('asset_balances', function (table) {
    table.integer('block_number').notNullable()
    table.string('holder_address').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('balance', 80, 0).notNullable()
    table.primary(['block_number', 'holder_address', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('asset_balances')
}
