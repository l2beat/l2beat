/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const NEW_TYPE = 'NMV'
const OLD_TYPE = 'EBV'

export async function up(knex: Knex) {
  await knex('reports').update({ report_type: NEW_TYPE }).where({
    chain_id: 42161,
    report_type: OLD_TYPE,
    asset_id: 'arbitrum:usdc-usd-coin',
    project_id: 'arbitrum',
  })
}

export async function down(knex: Knex) {
  await knex('reports').update({ report_type: OLD_TYPE }).where({
    chain_id: 42161,
    report_type: NEW_TYPE,
    asset_id: 'arbitrum:usdc-usd-coin',
    project_id: 'arbitrum',
  })
}
