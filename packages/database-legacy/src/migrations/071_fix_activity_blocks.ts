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
  await knex.raw(`
    UPDATE activity.block 
      SET count = count - 1 
      WHERE project_id = 'zora' 
        OR project_id = 'publicgoodsnetwork'
        OR project_id = 'base'
  `)
  await knex.raw(`
    UPDATE activity.block 
      SET count = count - 1 
      WHERE project_id = 'optimism'
       AND block_number >= 105235064
  `)
}

export async function down(_knex: Knex) {}
