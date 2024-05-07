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
  await knex.schema.createTable('aggregated_l2_costs', function (table) {
    table.dateTime('timestamp', { useTz: false }).notNullable().index()
    table.string('project_id').notNullable().index()
    table.integer('total_gas').notNullable()
    table.float('total_gas_eth').notNullable()
    table.float('total_gas_usd').notNullable()
    table.integer('blobs_gas')
    table.float('blobs_gas_eth')
    table.float('blobs_gas_usd')
    table.integer('calldata_gas').notNullable()
    table.float('calldata_gas_eth').notNullable()
    table.float('calldata_gas_usd').notNullable()
    table.integer('compute_gas').notNullable()
    table.float('compute_gas_eth').notNullable()
    table.float('compute_gas_usd').notNullable()
    table.float('overhead_gas_eth').notNullable()
    table.float('overhead_gas_usd').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('aggregated_l2_costs')
}
