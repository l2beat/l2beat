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
  await knex.schema.createTable('project_balances', (table) => {
    table.bigInteger('unix_timestamp').index()
    table.string('project_id').index()
    table.decimal('usd_tvl', 80, 0).notNullable()
    table.decimal('eth_tvl', 80, 0).notNullable()
    table.primary(['unix_timestamp', 'project_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('project_balances')
}
