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
  await knex.schema.dropTable('aggregated_reports')
  await knex.schema.dropTable('aggregated_reports_status')
  await knex.schema.dropTable('balances')
  await knex.schema.dropTable('balances_status')
  await knex.schema.dropTable('block_numbers')
  await knex.schema.dropTable('circulating_supplies')
  await knex.schema.dropTable('coingecko_prices')
  await knex.schema.dropTable('reports')
  await knex.schema.dropTable('reports_status')
  await knex.schema.dropTable('total_supplies')
  await knex.schema.dropTable('total_supplies_status')
}

export async function down() {}
