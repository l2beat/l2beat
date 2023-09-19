/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { AssetId, ChainId } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex('reports').update({ chain_id: +ChainId.ARBITRUM }).where({
    asset_id: AssetId.ARB.toString(),
  })

  await knex('reports').update({ chain_id: +ChainId.OPTIMISM }).where({
    asset_id: AssetId.OP.toString(),
  })
}

export async function down(knex: Knex) {
  await knex('reports').update({ chain_id: -1 }).where({
    asset_id: AssetId.ARB.toString(),
  })

  await knex('reports').update({ chain_id: -1 }).where({
    asset_id: AssetId.OP.toString(),
  })
}
