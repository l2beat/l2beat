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
  await knex.schema.alterTable('update_monitor', function (table) {
    table.integer('version').notNullable().defaultTo(0)
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('update_monitor', function (table) {
    table.dropColumn('version')
  })
}
