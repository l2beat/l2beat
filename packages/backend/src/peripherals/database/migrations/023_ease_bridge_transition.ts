/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { ProjectId } from '@l2beat/shared-pure'
import { Knex } from 'knex'

const ALL_ID = ProjectId('l2beat-all')
const LAYER2S_ID = ProjectId('l2beat-all')

export async function up(knex: Knex) {
  const hasLayer2Already = !!(await knex('aggregate_reports')
    .where('project_id', LAYER2S_ID)
    .first())
  if (!hasLayer2Already) {
    await knex('aggregate_reports')
      .where('project_id', ALL_ID)
      .update('project_id', LAYER2S_ID)
  }
}

export async function down() {
  // intentionally empty as resync actually will fix it automatically
}
