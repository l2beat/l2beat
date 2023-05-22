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
  await knex.schema.createTable('update_notifier', function (table) {
    table.increments('id').primary().unsigned()
    table.timestamps(true, true)

    table.string('project_name').notNullable().index()
    table.integer('block_number').notNullable().index()
    table.jsonb('diff_json_blob').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('update_notifier')
}
