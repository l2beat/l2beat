/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const ARB_CHAIN_ID = 42161

const NEW_ASSET_ID = 'arbitrum:usdc-usd-coin'
const OLD_ASSET_ID = 'usdc-usd-coin'

export async function up(knex: Knex) {
  await knex('total_supplies')
    .update({ asset_id: NEW_ASSET_ID })
    .where({ chain_id: +ARB_CHAIN_ID, asset_id: OLD_ASSET_ID })

  await knex('reports')
    .update({ asset_id: NEW_ASSET_ID })
    .where({
      chain_id: +ARB_CHAIN_ID,
      asset_id: OLD_ASSET_ID,
      project_id: 'arbitrum',
    })
    .andWhereRaw(`asset_type = 'EBV'`)
}

export async function down(knex: Knex) {
  await knex('total_supplies')
    .update({ asset_id: OLD_ASSET_ID })
    .where({ chain_id: +ARB_CHAIN_ID, asset_id: NEW_ASSET_ID })

  await knex('reports')
    .update({ asset_id: OLD_ASSET_ID })
    .where({
      chain_id: +ARB_CHAIN_ID,
      asset_id: NEW_ASSET_ID,
      project_id: 'arbitrum',
    })
    .andWhereRaw(`"asset_type" = 'EBV'`)
}
