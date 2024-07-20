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
  await knex.schema.createTable('daily_discovery', function (table) {
    table.string('project_name').notNullable()
    table.integer('chain_id').notNullable()
    table.dateTime('unix_timestamp', { useTz: false }).notNullable()
    table.integer('block_number').notNullable()
    table.integer('version').notNullable()
    table.string('config_hash').notNullable()
    table.jsonb('discovery_json_blob').notNullable()

    table.primary(['project_name', 'chain_id', 'unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('daily_discovery')
}
