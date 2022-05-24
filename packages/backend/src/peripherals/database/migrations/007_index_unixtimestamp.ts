import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.index(['unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.dropIndex(['unix_timestamp'])
  })
}
