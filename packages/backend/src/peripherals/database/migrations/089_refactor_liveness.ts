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
  await wipeLivenessTables(knex)

  await dropForeign(knex, 'liveness', 'liveness_configuration_id')

  // CONFIGURATIONS
  await knex.schema.alterTable('liveness_configuration', (table) => {
    table.dropPrimary()
    table.dropColumn('id')
    table.dropColumn('identifier')
    table.renameColumn('params', 'debug_info')
  })
  await knex.schema.alterTable('liveness_configuration', (table) => {
    table.string('id', 8).primary()
  })

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropPrimary()
    table.dropColumn('liveness_configuration_id')
    table.string('liveness_id', 8).notNullable()
    table.index('liveness_id')
  })

  await addForeign(knex, 'liveness', 'liveness_id', 'liveness_configuration')

  await knex.schema.alterTable('indexer_state', (table) => {
    table.dropColumn('config_hash')
  })
}

export async function down(knex: Knex) {
  await wipeLivenessTables(knex)

  await dropForeign(knex, 'liveness', 'liveness_id')

  // CONFIGURATIONS
  await knex.schema.alterTable('liveness_configuration', (table) => {
    table.dropPrimary()
    table.dropColumn('id')
    table.string('identifier').notNullable()
    table.renameColumn('debug_info', 'params')
  })
  await knex.schema.alterTable('liveness_configuration', (table) => {
    table.increments('id').primary()
  })

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropColumn('liveness_id')
    table.integer('liveness_configuration_id').notNullable()
    table.primary(['tx_hash', 'liveness_configuration_id'])
    table.index('liveness_configuration_id')
  })

  await addForeign(
    knex,
    'liveness',
    'liveness_configuration_id',
    'liveness_configuration',
  )

  await knex.schema.alterTable('indexer_state', (table) => {
    table.string('config_hash').notNullable()
  })
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

async function wipeLivenessTables(knex: Knex) {
  await knex('indexer_state').delete()
  await knex('liveness').delete()
  await knex('liveness_configuration').delete()
}
