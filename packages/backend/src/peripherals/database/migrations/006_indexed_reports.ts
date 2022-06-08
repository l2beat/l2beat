import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.boolean('isDaily').defaultTo(false).notNullable()
    table.index(['isDaily'])
  })

  await knex('reports')
    // @ts-expect-error: column isDaily change later to is_daily
    .update({ isDaily: true })
    .whereRaw('mod(reports.unix_timestamp,86400) = 0')
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.dropIndex(['isDaily'])
    table.dropColumn('isDaily')
  })
}
