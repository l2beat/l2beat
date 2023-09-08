/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { AssetId, ChainId, ProjectId } from '@l2beat/shared-pure'
import { Knex } from 'knex'

const NEW_TYPE = 'NMV'
const OLD_TYPE = 'EBV'

export async function up(knex: Knex) {
  await knex('reports').update({ report_type: NEW_TYPE }).where({
    chain_id: +ChainId.ARBITRUM,
    report_type: OLD_TYPE,
    asset_id: AssetId.USDC_ON_ARBITRUM.toString(),
    project_id: ProjectId.ARBITRUM.toString(),
  })
}

export async function down(knex: Knex) {
  await knex('reports').update({ report_type: OLD_TYPE }).where({
    chain_id: +ChainId.ARBITRUM,
    report_type: NEW_TYPE,
    asset_id: AssetId.USDC_ON_ARBITRUM.toString(),
    project_id: ProjectId.ARBITRUM.toString(),
  })
}
