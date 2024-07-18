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
  await knex.schema.alterTable('asset_balances', function (table) {
    table.integer('chain_id').notNullable().defaultTo(1)

    table.dropPrimary()
    table.primary(['chain_id', 'unix_timestamp', 'holder_address', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('asset_balances', function (table) {
    table.dropPrimary()
    table.primary(['unix_timestamp', 'holder_address', 'asset_id'])

    table.dropColumn('chain_id')
  })
}
