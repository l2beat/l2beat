/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

export async function up(knex: Knex) {
  await clearPrices(knex)

  await knex.schema.alterTable('prices', function (table) {
    table.dropPrimary()
    table.dropColumn('chain')
    table.dropColumn('address')

    table.specificType('configuration_id', 'CHAR(12)').notNullable()
    table.primary(['configuration_id', 'timestamp'])
  })
}

export async function down(knex: Knex) {
  await clearPrices(knex)

  await knex.schema.alterTable('prices', function (table) {
    table.dropPrimary()
    table.dropColumn('configuration_id')

    table.string('chain').notNullable()
    table.string('address').notNullable()
    table.primary(['timestamp', 'chain', 'address'])
  })
}

async function clearPrices(knex: Knex) {
  await knex('prices').delete()
  await knex('indexer_state')
    .delete()
    .whereLike('indexer_id', 'price_indexer_%')
}
