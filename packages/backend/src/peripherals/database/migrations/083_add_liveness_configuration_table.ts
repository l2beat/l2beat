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
  await knex.schema.createTable('liveness_configuration', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('identifier').notNullable()
    table.string('params').notNullable()
    table.dateTime('since_timestamp', { useTz: false }).notNullable()
    table.dateTime('until_timestamp', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })

    table.primary(['id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('liveness_configuration')
}
