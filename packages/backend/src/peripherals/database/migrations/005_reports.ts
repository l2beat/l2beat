import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('reports', function (table) {
    table.integer('block_number').notNullable()
    table.bigInteger('unix_timestamp').notNullable()
    table.string('bridge_address').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('usd_tvl', 80, 0).notNullable()
    table.decimal('eth_tvl', 80, 0).notNullable()
    table.primary(['block_number', 'bridge_address', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('reports')
}
