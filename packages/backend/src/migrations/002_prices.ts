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
  await knex.schema.alterTable('block_numbers', function (table) {
    table.dropPrimary()
    table.primary(['block_number'])
    table.index(['unix_timestamp'])
  })

  await knex.schema.createTable('exchange_prices', function (table) {
    table.integer('block_number').notNullable()
    table.string('asset_id').notNullable()
    table.string('exchange').notNullable()
    table.decimal('liquidity', 40, 0).notNullable()
    table.decimal('price', 40, 0).notNullable()

    table.primary(['block_number', 'asset_id', 'exchange'])
  })

  await knex.schema.createTable('aggregate_prices', function (table) {
    table.integer('block_number').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('price_usd', 40, 0).notNullable()

    table.primary(['block_number', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('block_numbers', function (table) {
    table.dropPrimary()
    table.primary(['unix_timestamp'])
    table.dropIndex(['unix_timestamp'])
  })

  await knex.schema.dropTable('exchange_prices')

  await knex.schema.dropTable('aggregate_prices')
}
