/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

/*
There was a bug causing the liveness indexer to duplicate work.
Issue was resolved in PR #2220.
Unfortunately the data in the DB got duplicated, so we decided that the most simple
approach is to remove all the data and start from scratch.
The sync process is quick and does not waste many resources.
*/

import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex('liveness_configuration').delete()
  await knex('liveness').delete()
  await knex('indexer_state').delete()
}

export async function down() {
  // There is nothing to add here. This migrations clear the specified tables.
}
