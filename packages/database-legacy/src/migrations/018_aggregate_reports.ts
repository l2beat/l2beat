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
  await knex.schema.createTable('aggregate_reports', function (table) {
    table.bigInteger('unix_timestamp').notNullable()
    table.string('project_id').notNullable().index()
    table.decimal('tvl_usd', 80, 0).notNullable()
    table.decimal('tvl_eth', 80, 0).notNullable()
    table.boolean('is_daily').notNullable().index()
    table.boolean('is_six_hourly').notNullable().index()
    table.primary(['unix_timestamp', 'project_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('aggregate_reports')
}
