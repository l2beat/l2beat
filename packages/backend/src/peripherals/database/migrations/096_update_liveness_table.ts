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

  // CONFIGURATIONS
  await knex.schema.dropTable('liveness_configuration')

  // LIVENESS
  await knex.schema.alterTable('liveness', (table) => {
    table.dropForeign(['liveness_id'])
    table.dropPrimary()
    table.dropColumn('liveness_configuration_id')
    table.string('config_hash', 8).notNullable()
    table.index('config_hash')
  })

  await addForeign(knex, 'liveness', 'config_hash', 'tracked_txs_configs')
}

export async function down(knex: Knex) {}

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
