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
  await knex.schema.dropTableIfExists('aggregated_reports')
  await knex.schema.dropTableIfExists('aggregated_reports_status')
  await knex.schema.dropTableIfExists('balances')
  await knex.schema.dropTableIfExists('balances_status')
  await knex.schema.dropTableIfExists('block_numbers')
  await knex.schema.dropTableIfExists('circulating_supplies')
  await knex.schema.dropTableIfExists('coingecko_prices')
  await knex.schema.dropTableIfExists('reports')
  await knex.schema.dropTableIfExists('reports_status')
  await knex.schema.dropTableIfExists('total_supplies')
  await knex.schema.dropTableIfExists('total_supplies_status')
}

export async function down(knex: Knex) {
  // Aggregated Reports
  await knex.schema.createTable('aggregated_reports', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.string('project_id', 255).notNullable()
    table.decimal('usd_value', 80, 0).notNullable()
    table.decimal('eth_value', 80, 0).notNullable()
    table.string('report_type', 255).notNullable().defaultTo('TVL')
    table.primary(['unix_timestamp', 'project_id', 'report_type'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS aggregated_reports_project_id_index
    ON public.aggregated_reports (project_id)
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS aggregated_reports_unix_timestamp_daily_index
    ON public.aggregated_reports (unix_timestamp ASC NULLS LAST)
    WHERE EXTRACT(hour FROM unix_timestamp) = 0
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS aggregated_reports_unix_timestamp_six_hourly_index
    ON public.aggregated_reports (unix_timestamp ASC NULLS LAST)
    WHERE (EXTRACT(hour FROM unix_timestamp) % 6) = 0
  `)

  // Aggregated Reports Status
  await knex.schema.createTable('aggregated_reports_status', function (table) {
    table.string('config_hash', 255).notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.primary(['config_hash', 'unix_timestamp'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS aggregated_reports_status_config_hash_index
    ON public.aggregated_reports_status (config_hash)
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS aggregated_reports_status_unix_timestamp_index
    ON public.aggregated_reports_status (unix_timestamp)
  `)

  // Balances
  await knex.schema.createTable('balances', function (table) {
    table.string('holder_address', 255).notNullable()
    table.string('asset_id', 255).notNullable()
    table.decimal('balance', 80, 0).notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('chain_id').notNullable().defaultTo(1)
    table.primary(['chain_id', 'unix_timestamp', 'holder_address', 'asset_id'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS balances_unix_timestamp_index
    ON public.balances (unix_timestamp)
  `)

  // Balances Status
  await knex.schema.createTable('balances_status', function (table) {
    table.string('config_hash', 255).notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('chain_id').notNullable().defaultTo(1)
    table.primary(['chain_id', 'unix_timestamp'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS balances_status_chain_id_config_hash_index
    ON public.balances_status (chain_id, config_hash)
  `)

  // Block Numbers
  await knex.schema.createTable('block_numbers', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('block_number').notNullable()
    table.integer('chain_id').notNullable().defaultTo(1)
    table.primary(['chain_id', 'unix_timestamp'])
  })

  // Circulating Supplies
  await knex.schema.createTable('circulating_supplies', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.bigInteger('circulating_supply').notNullable()
    table.string('asset_id', 255).notNullable()
    table.integer('chain_id').notNullable()
    table.primary(['chain_id', 'unix_timestamp', 'asset_id'])
  })

  // Coingecko Prices
  await knex.schema.createTable('coingecko_prices', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.float('price_usd').notNullable()
    table.string('asset_id', 255).notNullable()
    table.primary(['unix_timestamp', 'asset_id'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS coingecko_prices_asset_id_index
    ON public.coingecko_prices (asset_id)
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS coingecko_prices_unix_timestamp_index
    ON public.coingecko_prices (unix_timestamp)
  `)

  // Reports
  await knex.schema.createTable('reports', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.string('project_id', 255).notNullable()
    table.string('asset_id', 255).notNullable()
    table.decimal('asset_amount', 80, 0).notNullable()
    table.decimal('usd_value', 80, 0).notNullable()
    table.decimal('eth_value', 80, 0).notNullable()
    table.string('report_type', 255).notNullable().defaultTo('CBV')
    table.integer('chain_id').notNullable().defaultTo(1)
    table.primary([
      'chain_id',
      'report_type',
      'unix_timestamp',
      'asset_id',
      'project_id',
    ])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS reports_unix_timestamp_daily_index
    ON public.reports (unix_timestamp, project_id, asset_id)
    WHERE EXTRACT(hour FROM unix_timestamp) = 0
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS reports_unix_timestamp_index
    ON public.reports (unix_timestamp)
  `)

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS reports_unix_timestamp_six_hourly_index
    ON public.reports (unix_timestamp, project_id, asset_id)
    WHERE (EXTRACT(hour FROM unix_timestamp) % 6) = 0
  `)

  // Reports Status
  await knex.schema.createTable('reports_status', function (table) {
    table.string('config_hash', 255).notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('chain_id').notNullable().defaultTo(1)
    table.string('report_type', 255).notNullable().defaultTo('CBV')
    table.primary(['chain_id', 'report_type', 'unix_timestamp', 'config_hash'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS reports_status_chain_id_asset_type_config_hash_index
    ON public.reports_status (chain_id, report_type, config_hash)
  `)

  // Total Supplies
  await knex.schema.createTable('total_supplies', function (table) {
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.decimal('total_supply', 80, 0).notNullable()
    table.string('asset_id', 255).notNullable()
    table.integer('chain_id').notNullable()
    table.primary(['chain_id', 'unix_timestamp', 'asset_id'])
  })

  // Total Supplies Status
  await knex.schema.createTable('total_supplies_status', function (table) {
    table.string('config_hash', 255).notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('chain_id').notNullable()
    table.primary(['chain_id', 'unix_timestamp'])
  })

  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS total_supplies_status_chain_id_config_hash_index
    ON public.total_supplies_status (chain_id, config_hash)
  `)
}
