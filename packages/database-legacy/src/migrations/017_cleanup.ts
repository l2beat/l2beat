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
  await knex.schema.dropTable('exchange_prices')
  await knex.schema.dropTable('aggregate_prices')
  await knex.schema.dropTable('reports_old')
  await knex.schema.alterTable('reports', function (table) {
    table.index(['is_daily'])
    table.index(['unix_timestamp'])
  })
  await knex.raw(
    'ALTER TABLE reports RENAME CONSTRAINT reports_tmp_pkey TO reports_pkey;',
  )
}

export async function down(knex: Knex) {
  await knex.raw(
    'ALTER TABLE reports RENAME CONSTRAINT reports_pkey TO reports_tmp_pkey;',
  )

  await knex.schema.alterTable('reports', function (table) {
    table.dropIndex(['unix_timestamp'])
    table.dropIndex(['is_daily'])
  })

  await knex.schema.createTable('reports_old', function (table) {
    table.integer('block_number').notNullable()
    table.bigInteger('unix_timestamp').notNullable()
    table.string('bridge_address').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('usd_tvl', 80, 0).notNullable()
    table.decimal('eth_tvl', 80, 0).notNullable()
    table.primary(['block_number', 'bridge_address', 'asset_id'], {
      constraintName: 'reports_pkey',
    })
    table.boolean('is_daily').defaultTo(false).notNullable()
    table.index(['is_daily'], 'reports_isdaily_index')
    table.index(['unix_timestamp'], 'reports_unix_timestamp_index')
    table.decimal('balance', 80, 0).defaultTo(0).notNullable()
    table.string('project_id')
  })

  await knex.schema.createTable('aggregate_prices', function (table) {
    table.integer('block_number').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('price_usd', 40, 0).notNullable()

    table.primary(['block_number', 'asset_id'])
  })

  await knex.schema.createTable('exchange_prices', function (table) {
    table.integer('block_number').notNullable()
    table.string('asset_id').notNullable()
    table.string('exchange').notNullable()
    table.decimal('liquidity', 40, 0).notNullable()
    table.decimal('price', 40, 0).notNullable()

    table.primary(['block_number', 'asset_id', 'exchange'])
  })
}
