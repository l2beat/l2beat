/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { ChainId } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.integer('chain_id').notNullable().defaultTo(Number(ChainId.ETHEREUM))

    table.dropPrimary()
    table.primary([
      'chain_id',
      'asset_type',
      'unix_timestamp',
      'asset_id',
      'project_id',
    ])
  })

  await knex('reports').where('asset_type', 'NMV').update({ chain_id: -1 })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.dropPrimary()
    table.primary(['unix_timestamp', 'project_id', 'asset_id'])

    table.dropColumn('chain_id')
  })
}
