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
  await knex.schema.alterTable('balances_status', function (table) {
    table.integer('chain_id').notNullable().defaultTo(Number(ChainId.ETHEREUM))

    table.dropIndex(['config_hash'])
    table.dropIndex(['unix_timestamp'])

    table.index(['chain_id', 'config_hash'])

    table.dropPrimary()
    table.primary(['chain_id', 'unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('balances_status', function (table) {
    table.dropIndex(['chain_id', 'config_hash'])
    table.dropPrimary()

    table.primary(['config_hash', 'unix_timestamp'])
    table.index(['unix_timestamp'])
    table.index(['config_hash'])

    table.dropColumn('chain_id')
  })
}
