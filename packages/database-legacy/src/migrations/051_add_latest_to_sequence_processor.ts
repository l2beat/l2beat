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
  await knex.schema.alterTable('sequence_processor', (t) => {
    t.integer('latest').nullable()
    t.renameColumn('finished_processing_at', 'updated_at')
  })
  // only temporary - will overwrite on first run
  // that's the simplest solution
  await knex.schema.raw('update sequence_processor set latest = last_processed')
  await knex.schema.alterTable('sequence_processor', (t) => {
    t.dropNullable('latest')
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('sequence_processor', (t) => {
    t.dropColumn('latest')
    t.renameColumn('updated_at', 'finished_processing_at')
  })
}
