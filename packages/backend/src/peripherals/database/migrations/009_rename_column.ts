import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.renameColumn('isDaily', 'is_daily')
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.renameColumn('is_daily', 'isDaily')
  })
}
