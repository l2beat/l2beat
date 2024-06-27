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
  await dropForeign(knex, 'l2_costs', 'tracked_tx_id')
  await dropForeign(knex, 'liveness', 'tracked_tx_id')

  await knex.schema.alterTable('l2_costs', function (table) {
    table.string('tracked_tx_id', 12).notNullable().alter()
  })

  await knex.schema.alterTable('liveness', function (table) {
    table.string('tracked_tx_id', 12).notNullable().alter()
  })

  await knex.schema.alterTable('tracked_txs_configs', function (table) {
    table.dropPrimary()
  })
  await knex.schema.dropTable('tracked_txs_configs')
}

export async function down(knex: Knex) {
  await addForeign(knex, 'l2_costs', 'tracked_tx_id', 'tracked_txs_configs')
  await addForeign(knex, 'liveness', 'tracked_tx_id', 'tracked_txs_configs')

  await knex.schema.createTable('tracked_txs_configs', function (table) {
    table.string('id').notNullable().primary()
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('subtype')
    table.string('debug_info').notNullable()
    table.dateTime('since_timestamp_inclusive', { useTz: false })
    table.dateTime('until_timestamp_exclusive', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })
  })

  await knex.schema.alterTable('l2_costs', function (table) {
    table.string('tracked_tx_id', 8).notNullable().alter()
  })

  await knex.schema.alterTable('liveness', function (table) {
    table.string('tracked_tx_id', 8).notNullable().alter()
  })

  const rowsToFix = await knex('tracked_txs_configs').whereRaw(
    'until_timestamp_exclusive < last_synced_timestamp',
  )

  for (const row of rowsToFix) {
    await knex('tracked_txs_configs')
      .where('id', row.id)
      .update({ last_synced_timestamp: row.until_timestamp_exclusive })
  }
}

async function addForeign(
  knex: Knex,
  tableName: string,
  columnName: string,
  foreignTable: string,
  foreignKey = 'id',
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
