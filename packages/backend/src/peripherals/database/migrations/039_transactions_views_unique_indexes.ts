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
  await knex.schema.raw(`
    CREATE UNIQUE INDEX block_count_view_unique_idx
    ON transactions.block_count_view (project_id, unix_timestamp)`)
  await knex.schema.raw(`
    CREATE UNIQUE INDEX zksync_count_view_unique_idx
    ON transactions.zksync_count_view (unix_timestamp)`)
}

export async function down(knex: Knex) {
  await knex.schema.raw('DROP INDEX transactions.block_count_view_unique_idx')
  await knex.schema.raw('DROP INDEX transactions.zksync_count_view_unique_idx')
}
