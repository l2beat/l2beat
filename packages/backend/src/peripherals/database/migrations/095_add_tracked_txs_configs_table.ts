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
  await knex.schema.createTable('tracked_txs_configs', function (table) {
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('subtype')
    table.string('debug_info').notNullable()
    table.dateTime('since_timestamp', { useTz: false })
    table.dateTime('until_timestamp', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })
    table.string('config_hash').notNullable()

    table.index('config_hash')
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('tracked_txs_configs')
}
