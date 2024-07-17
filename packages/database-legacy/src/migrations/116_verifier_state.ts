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
  await knex.schema.createTable('verifier_status', function (table) {
    table.string('address').notNullable()
    table.integer('chain_id').notNullable()
    table.dateTime('last_used', { useTz: false }).notNullable()
    table.dateTime('last_updated', { useTz: false }).notNullable()
    table.primary(['address', 'chain_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('verifier_status')
}
