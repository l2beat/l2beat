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
  await knex.schema.createTable('anomalies', function (table) {
    table.dateTime('timestamp', { useTz: false }).notNullable()
    table.string('project_id').notNullable()
    table.string('subtype').notNullable()
    table.integer('duration').notNullable()

    table.primary(['timestamp', 'project_id', 'subtype'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('anomalies')
}
