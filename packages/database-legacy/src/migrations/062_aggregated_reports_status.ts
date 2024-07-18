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
  await knex.schema.createTable('aggregated_reports_status', function (table) {
    table.string('config_hash').notNullable().index()
    table.dateTime('unix_timestamp', { useTz: false }).index()
    table.primary(['config_hash', 'unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('aggregated_reports_status')
}
