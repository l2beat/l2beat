/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { assert } from '@l2beat/backend-tools'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  const rows = await knex('liveness')
  assert(rows.length === 0, 'Table should be empty')

  await knex.schema.table('liveness', function (table) {
    table.dropPrimary()
    table.dropColumn('project_id')
    table.dropColumn('type')
    table.integer('liveness_configuration_id').unsigned().notNullable()
    table
      .foreign('liveness_configuration_id')
      .references('id')
      .inTable('liveness_configuration')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex) {
  await knex.schema.table('liveness', function (table) {
    table.string('project_id').notNullable().defaultTo('')
    table.string('type').notNullable().defaultTo('')
    table.primary(['tx_hash', 'type'])
    table.dropColumn('liveness_configuration_id')
  })
}
