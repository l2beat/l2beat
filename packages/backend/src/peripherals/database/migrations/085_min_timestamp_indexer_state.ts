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
  const rows = await knex('indexer_state')
  assert(rows.length === 0, 'Table should be empty')

  await knex.schema.table('indexer_state', function (table) {
    table.dateTime('min_timestamp', { useTz: false }).nullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.table('indexer_state', function (table) {
    table.dropColumn('min_timestamp')
  })
}
