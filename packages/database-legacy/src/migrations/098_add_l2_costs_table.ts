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
  await knex.schema.createTable('l2_costs', function (table) {
    table.string('tracked_tx_id', 8).notNullable().index()
    table.string('tx_hash').notNullable()
    table.dateTime('timestamp', { useTz: false }).notNullable()
    table.jsonb('data').notNullable()
  })

  await addForeign(
    knex,
    'l2_costs',
    'tracked_tx_id',
    'tracked_txs_configs',
    'id',
  )
}

export async function down(knex: Knex) {
  await dropForeign(knex, 'l2_costs', 'tracked_tx_id')
  await knex.schema.dropTable('l2_costs')
}

async function addForeign(
  knex: Knex,
  tableName: string,
  columnName: string,
  foreignTable: string,
  foreignKey: string,
) {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign(columnName)
      .references(foreignKey)
      .inTable(foreignTable)
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

async function dropForeign(knex: Knex, tableName: string, columnName: string) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropForeign([columnName])
  })
}
