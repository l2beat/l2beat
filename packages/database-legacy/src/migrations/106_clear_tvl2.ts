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
  await clearTvl2(knex)
}

export async function down(knex: Knex) {
  await clearTvl2(knex)
}

// This function and whole migration is called "tvl2" because
// during rewrite of tvl we had two packages "tvl" and "tvl2"
// after rewrite we have only "tvl" package
async function clearTvl2(knex: Knex) {
  await knex('prices').delete()

  await knex('amounts').delete()

  await knex('indexer_state')
    .delete()
    .whereLike('indexer_id', 'price_indexer%')
    .orWhereLike('indexer_id', 'block_timestamp_indexer%')
    .orWhereLike('indexer_id', 'chain_amount_indexer%')
    .orWhereLike('indexer_id', 'circulating_supply_indexer%')

  await knex('indexer_configurations').delete()
}
