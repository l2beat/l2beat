/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { ValueType } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('aggregated_reports', function (table) {
    table.string('value_type').notNullable().defaultTo(ValueType.TVL)

    table.dropPrimary()

    table.primary(['unix_timestamp', 'project_id', 'value_type'])

    table.renameColumn('tvl_usd', 'usd_value')
    table.renameColumn('tvl_eth', 'eth_value')
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('aggregated_reports', function (table) {
    table.dropPrimary()
    table.dropColumn('value_type')
    table.primary(['unix_timestamp', 'project_id'])

    table.renameColumn('usd_value', 'tvl_usd')
    table.renameColumn('eth_value', 'tvl_eth')
  })
}
