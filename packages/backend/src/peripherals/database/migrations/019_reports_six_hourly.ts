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
    table.boolean('is_six_hourly').defaultTo(false).index()
  })
  await knex('reports')
    // @ts-expect-error-next-line
    .update({ is_six_hourly: true })
    .whereRaw('unix_timestamp % 21600 = 0')
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.dropColumn('is_six_hourly')
  })
}
