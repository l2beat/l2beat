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
  await knex.schema.createTable('circulating_supplies', function (table) {
    // eslint-disable-next-line custom-rules/db_ts_no_tz
    table.dateTime('unix_timestamp').notNullable()
    table.bigInteger('circulating_supply').notNullable()
    table.string('asset_id').notNullable()
    table.integer('chain_id').notNullable()

    table.primary(['chain_id', 'unix_timestamp', 'asset_id'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('circulating_supplies')
}
