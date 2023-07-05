/*
/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { AssetId, ValueType } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.renameColumn('balance', 'asset_amount')
    table.renameColumn('balance_usd', 'usd_value')
    table.renameColumn('balance_eth', 'eth_value')

    table.string('asset_type').notNullable().defaultTo(ValueType.CBV)
  })

  await knex('reports')
    .whereIn('asset_id', [AssetId.ARB, AssetId.OP])
    .update({ asset_type: ValueType.NMV.toString() })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports', function (table) {
    table.renameColumn('asset_amount', 'balance')
    table.renameColumn('usd_value', 'balance_usd')
    table.renameColumn('eth_value', 'balance_eth')

    table.dropColumn('asset_type')
  })
}
