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
  await knex('liveness').delete()
  await knex('l2_costs').delete()

  await knex.schema.alterTable('l2_costs', function (table) {
    table.dropColumn('tracked_tx_id')
    table.string('configuration_id', 12).notNullable()
  })

  await knex.schema.alterTable('liveness', function (table) {
    table.dropColumn('tracked_tx_id')
    table.string('configuration_id', 12).notNullable()
  })

  await knex.schema.dropTable('tracked_txs_configs')
}

export async function down(knex: Knex) {
  await knex('l2_costs').delete()
  await knex('liveness').delete()

  await knex.schema.createTable('tracked_txs_configs', function (table) {
    table.string('id', 8).notNullable().primary()
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('subtype')
    table.string('debug_info').notNullable()
    table.dateTime('since_timestamp_inclusive', { useTz: false })
    table.dateTime('until_timestamp_exclusive', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })
  })

  await knex.schema.alterTable('l2_costs', function (table) {
    table.dropColumn('configuration_id')
    table.string('tracked_tx_id', 8).notNullable().index()
  })

  await knex.schema.alterTable('liveness', function (table) {
    table.dropColumn('configuration_id')
    table.string('tracked_tx_id', 8).notNullable().index()
  })

  await addForeign(
    knex,
    'liveness',
    'tracked_tx_id',
    'tracked_txs_configs',
    'id',
  )
  await addForeign(
    knex,
    'l2_costs',
    'tracked_tx_id',
    'tracked_txs_configs',
    'id',
  )
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
