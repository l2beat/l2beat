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
