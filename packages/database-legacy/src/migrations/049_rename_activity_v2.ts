/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const oldName = 'activity_v2'
const newName = 'activity'

export async function up(knex: Knex) {
  await knex.schema.raw(`alter schema ${oldName} rename to ${newName}`)
}

export async function down(knex: Knex) {
  await knex.schema.raw(`alter schema ${newName} rename to ${oldName}`)
}
