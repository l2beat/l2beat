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
  await knex('indexer_state').delete()
  await knex('liveness').delete()
  await knex('liveness_configuration').delete()

  await dropForeign(knex, 'liveness', 'liveness_id')
  // CONFIGURATIONS
  await knex.schema.dropTable('liveness_configuration')

  await knex.schema.createTable('tracked_txs_configs', function (table) {
    table.string('id').notNullable().primary()
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('subtype')
    table.string('debug_info').notNullable()
    table.dateTime('since_timestamp', { useTz: false })
    table.dateTime('until_timestamp', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })
  })

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropColumn('liveness_id')
    table.string('tracked_tx_id', 8).notNullable()
    table.index('tracked_tx_id')
  })

  await addForeign(
    knex,
    'liveness',
    'tracked_tx_id',
    'tracked_txs_configs',
    'id',
  )
}

export async function down(knex: Knex) {
  await knex('indexer_state').delete()
  await knex('liveness').delete()
  await knex('tracked_txs_configs').delete()

  await dropForeign(knex, 'liveness', 'tracked_tx_id')
  await knex.schema.dropTable('tracked_txs_configs')

  await knex.schema.createTable('liveness_configuration', function (table) {
    table.string('id', 8).primary()
    table.string('project_id').notNullable()
    table.string('type').notNullable()
    table.string('debug_info').notNullable()
    table.dateTime('since_timestamp', { useTz: false }).notNullable()
    table.dateTime('until_timestamp', { useTz: false })
    table.dateTime('last_synced_timestamp', { useTz: false })
  })

  await knex.schema.alterTable('liveness', (table) => {
    table.dropColumn('tracked_tx_id')
    table.string('liveness_id', 8).notNullable()
    table.index('liveness_id')
  })

  await addForeign(
    knex,
    'liveness',
    'liveness_id',
    'liveness_configuration',
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

async function dropForeign(knex: Knex, tableName: string, columnName: string) {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropForeign([columnName])
  })
}
