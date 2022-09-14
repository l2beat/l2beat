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
  await knex.schema.createTable('events', function (table) {
    table.bigInteger('unix_timestamp').notNullable()
    table.string('event_name').notNullable()
    table.string('project_id').notNullable()
    table.integer('count').notNullable()
    table
      .string('time_span')
      .checkIn(['hourly', 'sixHourly', 'daily'])
      .notNullable()
    table.primary(['unix_timestamp', 'project_id', 'event_name', 'time_span'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('events')
}
