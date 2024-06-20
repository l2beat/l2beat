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
  await knex.schema.dropTableIfExists('aggregated_reports')
  await knex.schema.dropTableIfExists('aggregated_reports_status')
  await knex.schema.dropTableIfExists('balances')
  await knex.schema.dropTableIfExists('balances_status')
  await knex.schema.dropTableIfExists('block_numbers')
  await knex.schema.dropTableIfExists('circulating_supplies')
  await knex.schema.dropTableIfExists('coingecko_prices')
  await knex.schema.dropTableIfExists('reports')
  await knex.schema.dropTableIfExists('reports_status')
  await knex.schema.dropTableIfExists('total_supplies')
  await knex.schema.dropTableIfExists('total_supplies_status')
}

export async function down() {}
