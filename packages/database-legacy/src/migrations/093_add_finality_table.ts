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
  await knex.schema.createTable('finality', function (table) {
    table.string('project_id').notNullable()
    table.dateTime('timestamp', { useTz: false }).notNullable()
    table.integer('minimum_time_to_inclusion').notNullable()
    table.integer('maximum_time_to_inclusion').notNullable()
    table.integer('average_time_to_inclusion').notNullable()

    table.primary(['project_id', 'timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('finality')
}
