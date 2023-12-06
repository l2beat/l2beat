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
  await knex.schema
    .alterTable('liveness_configuration', (table) => {
      table.dropPrimary()
      table.dropColumn('id')
      table.dropColumn('identifier')
      table.renameColumn('params', 'debug_info')
    })
    .then(() => {
      return knex.schema.alterTable('liveness_configuration', (table) => {
        table.string('id', 8).primary()
      })
    })

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropPrimary()
    table.dropColumn('liveness_configuration_id')
    table.string('liveness_id', 8).notNullable()
    table.primary(['liveness_id', 'tx_hash'])
  })

  await addForeign(knex, 'liveness', 'liveness_id', 'liveness_configuration')
}

export async function down(knex: Knex) {
  await wipeLivenessTables(knex)

  await dropForeign(knex, 'liveness', 'liveness_id')

  // CONFIGURATIONS
  await knex.schema
    .alterTable('liveness_configuration', (table) => {
      table.dropPrimary()
      table.dropColumn('id')
      table.string('identifier').notNullable()
      table.renameColumn('debug_info', 'params')
    })
    .then(() => {
      return knex.schema.alterTable('liveness_configuration', (table) => {
        table.increments('id').primary()
      })
    })

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropPrimary()
    table.dropColumn('liveness_id')
    table.integer('liveness_configuration_id').notNullable()
    table.primary(['liveness_configuration_id', 'tx_hash'])
  })

  await addForeign(
    knex,
    'liveness',
    'liveness_configuration_id',
    'liveness_configuration',
  )
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
