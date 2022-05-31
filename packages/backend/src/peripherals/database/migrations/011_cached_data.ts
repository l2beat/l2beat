import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('cached_data', function (table) {
    table.integer('id').notNullable()
    table.bigInteger('unix_timestamp').notNullable()
    table.jsonb('data').notNullable()
    
    table.primary(['id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('cached_data')
}
