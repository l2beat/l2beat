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
  await knex.schema.createTable('coingecko_prices', function (table) {
    table.string('coingecko_id').notNullable()
    table.bigInteger('unix_timestamp').notNullable()
    table.float('price_usd').notNullable()
    table.primary(['coingecko_id', 'unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('coingecko_prices')
}
