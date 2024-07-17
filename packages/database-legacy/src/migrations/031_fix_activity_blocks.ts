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
  await knex('transactions.block')
    .update({ count: 0 })
    .where({ block_number: 0, project_id: 'nova' })
  await knex('transactions.block')
    .delete()
    .where('project_id', 'ethereum')
    .andWhere('block_number', '<', 8929324)
}

export async function down(_knex: Knex) {}
