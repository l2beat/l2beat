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
  await knex.schema.alterTable('asset_balances', (table) => {
    table.bigInteger('unix_timestamp').index()
  })
  await knex.raw(
    'UPDATE asset_balances SET unix_timestamp = block_numbers.unix_timestamp FROM block_numbers WHERE asset_balances.block_number = block_numbers.block_number'
  )
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('asset_balances', (table) => {
    table.dropColumn('unix_timestamp')
  })
}
