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

const ASSET_ID = 'arbitrum:usdc-usd-coin'

export async function up(knex: Knex) {
  await knex('reports').update({ report_type: 'NMV' }).where({
    chain_id: +ChainId.ARBITRUM,
    report_type: 'EBV',
    asset_id: ASSET_ID,
  })
}

export async function down(knex: Knex) {
  await knex('reports').update({ report_type: 'EBV' }).where({
    chain_id: +ChainId.ARBITRUM,
    report_type: 'NMV',
    asset_id: ASSET_ID,
  })
}
