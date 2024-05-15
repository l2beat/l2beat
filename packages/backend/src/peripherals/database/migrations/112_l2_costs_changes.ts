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
  await knex('indexer_state')
    .delete()
    .where('indexer_id', '=', 'tracked_txs_indexer')
  await knex('liveness').delete()
  await knex('l2_costs').delete()
  await knex('tracked_txs_configs').delete()
  await knex.schema.alterTable('l2_costs', (tB) => {
    tB.dropColumn('data')
    tB.integer('gas_used').notNullable()
    tB.bigInteger('gas_price').notNullable()
    tB.integer('calldata_gas_used').notNullable()
    tB.integer('calldata_length').notNullable()
    tB.integer('blob_gas_used')
    tB.bigInteger('blob_gas_price')
  })
}

export async function down(knex: Knex) {
  await knex('indexer_state')
    .delete()
    .where('indexer_id', '=', 'tracked_txs_indexer')
  await knex('liveness').delete()
  await knex('l2_costs').delete()
  await knex('tracked_txs_configs').delete()
  await knex.schema.alterTable('l2_costs', (tB) => {
    tB.jsonb('data').notNullable()
    tB.dropColumn('gas_used')
    tB.dropColumn('gas_price')
    tB.dropColumn('calldata_gas_used')
    tB.dropColumn('calldata_length')
    tB.dropColumn('blob_gas_used')
    tB.dropColumn('blob_gas_price')
  })
}
