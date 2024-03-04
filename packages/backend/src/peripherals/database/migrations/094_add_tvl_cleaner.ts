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
  await knex.schema.createTable('tvl_cleaner', function (table) {
    table.string('repository_name').primary()
    table.dateTime('hourly_cleaned_until', { useTz: false })
    table.dateTime('six_hourly_cleaned_until', { useTz: false })
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('tvl_cleaner')
}
