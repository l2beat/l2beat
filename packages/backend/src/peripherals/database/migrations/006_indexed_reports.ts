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
