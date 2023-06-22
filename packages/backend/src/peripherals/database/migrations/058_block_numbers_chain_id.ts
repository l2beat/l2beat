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
  await knex.schema.alterTable('block_numbers', function (table) {
    table
      .string('chain_id')
      .notNullable()
      .defaultTo(ChainId.ETHEREUM.toString())

    table.dropIndex(['unix_timestamp'])

    table.dropPrimary()
    table.primary(['unix_timestamp', 'chain_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('block_numbers', function (table) {
    table.dropPrimary()
    table.primary(['block_number'])

    table.index(['unix_timestamp'])

    table.dropColumn('chain_id')
  })
}
