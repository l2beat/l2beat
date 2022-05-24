import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.decimal('balance', 80, 0).defaultTo(0).notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.dropColumn('balance')
  })
}
