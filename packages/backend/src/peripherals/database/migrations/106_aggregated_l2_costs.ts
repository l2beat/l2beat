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
    table.integer('total_gas_used').notNullable()
    table.integer('calldata_gas_used').notNullable()
    table.integer('blobs_gas_used')
    table.integer('compute_gas_used').notNullable()
    table.integer('overhead_gas_used').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('l2_costs')
}
