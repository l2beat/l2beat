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
  await knex.schema.alterTable('coingecko_prices', (table) => {
    table.string('asset_id').index()
    table.index('unix_timestamp')
  })
  // this used to update all asset_ids to correct values
  await knex('coingecko_prices').where({ asset_id: null }).delete()

  await knex.schema.alterTable('coingecko_prices', (table) => {
    table.dropPrimary()
    table.string('asset_id').notNullable().alter()
    table.dropColumn('coingecko_id')
    table.primary(['unix_timestamp', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('coingecko_prices', (table) => {
    table.string('coingecko_id')
  })
  // this used to update all coingecko_ids to correct values

  await knex('coingecko_prices').delete()

  await knex.schema.alterTable('coingecko_prices', (table) => {
    table.dropPrimary()
    table.string('coingecko_id').notNullable().alter()
    table.primary(['coingecko_id', 'unix_timestamp'])
    table.dropIndex('unix_timestamp')
    table.dropIndex('asset_id')
    table.dropColumn('asset_id')
  })
}
