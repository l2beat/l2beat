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
  await knex.schema.createTable('aggregated_liveness', function (table) {
    table.string('project_id').notNullable()
    table.string('subtype').notNullable()
    table.string('range').notNullable()
    table.integer('min').notNullable()
    table.integer('avg').notNullable()
    table.integer('max').notNullable()
    table.dateTime('updated_at', { useTz: false }).notNullable()

    table.primary(['project_id', 'subtype', 'range'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('aggregated_liveness')
}
