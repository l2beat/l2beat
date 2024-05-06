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
  await knex.schema.createTable('values', function (table) {
    table.dateTime('timestamp', { useTz: false })
    table.string('project_id')
    table.string('data_source')
    table.integer('external')
    table.integer('canonical')
    table.integer('native')
    table.primary(['timestamp', 'project_id', 'data_source'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('values')
}
