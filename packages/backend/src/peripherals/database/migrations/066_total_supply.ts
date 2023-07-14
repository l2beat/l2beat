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
  await knex.schema.createTable('total_supplies', function (table) {
    table.dateTime('unix_timestamp').notNullable()
    table.decimal('total_supply', 80, 0).notNullable()
    table.string('asset_id').notNullable()
    table.integer('chain_id').notNullable()

    table.primary(['chain_id', 'unix_timestamp', 'asset_id'])
  })

  await knex.schema.createTable('total_supplies_status', function (table) {
    table.string('config_hash').notNullable()
    table.dateTime('unix_timestamp').notNullable()
    table.integer('chain_id').notNullable()

    table.index(['chain_id', 'config_hash'])

    table.primary(['chain_id', 'unix_timestamp'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('total_supplies')
  await knex.schema.dropTable('total_supplies_status')
}
