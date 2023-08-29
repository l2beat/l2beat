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

const ARB_ASSET_ID = 'arb-arbitrum'
const OP_ASSET_ID = 'op-optimism'

export async function up(knex: Knex) {
  await knex('reports')
    .update({ chain_id: +ChainId.ARBITRUM })
    .where({ chain_id: +ChainId.NMV, asset_id: ARB_ASSET_ID })
  await knex('reports')
    .update({ chain_id: +ChainId.OPTIMISM })
    .where({ chain_id: +ChainId.NMV, asset_id: OP_ASSET_ID })
}

export async function down(knex: Knex) {
  await knex('reports')
    .update({ chain_id: +ChainId.NMV })
    .where({ chain_id: +ChainId.ARBITRUM, asset_id: ARB_ASSET_ID })
  await knex('reports')
    .update({ chain_id: +ChainId.NMV })
    .where({ chain_id: +ChainId.OPTIMISM, asset_id: OP_ASSET_ID })
}
