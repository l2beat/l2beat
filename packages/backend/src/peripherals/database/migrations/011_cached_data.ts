import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('cached_data', function (table) {
    table.integer('id').primary()
    table.bigInteger('unix_timestamp').notNullable()
    table.jsonb('data').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('cached_data')
}
