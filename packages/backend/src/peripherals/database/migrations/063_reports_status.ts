/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { ChainId, ValueType } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports_status', function (table) {
    table.integer('chain_id').notNullable().defaultTo(ChainId.ETHEREUM)
    table.string('asset_type').notNullable().defaultTo(ValueType.CBV)

    table.dropPrimary()
    table.dropIndex('config_hash')
    table.dropIndex('unix_timestamp')
    table.primary(['chain_id', 'asset_type', 'unix_timestamp', 'config_hash'])
    table.index(['chain_id', 'asset_type', 'config_hash'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('reports_status', function (table) {
    table.dropPrimary()
    table.dropIndex(['chain_id', 'asset_type', 'config_hash'])
    table.primary(['config_hash', 'unix_timestamp'])
    table.index('config_hash')
    table.index('unix_timestamp')

    table.dropColumn('chain_id')
    table.dropColumn('asset_type')
  })
}
