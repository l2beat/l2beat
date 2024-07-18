/*
                      ====== IMPORTANT NOTICE ======
DO NOT EDIT OR RENAME THIS FILE
This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.
If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.
*/

import { Knex } from 'knex'

// This migration is to resync the degen and popapex projects
// The resync is needed because of the reorg that happened on the network
export async function up(knex: Knex) {
  await knex('activity.block')
    .delete()
    .where('project_id', '=', 'degen')
    .orWhere('project_id', '=', 'popapex')

  await knex('sequence_processor')
    .delete()
    .where('id', '=', 'degen')
    .orWhere('id', '=', 'popapex')
}

export async function down() {}
