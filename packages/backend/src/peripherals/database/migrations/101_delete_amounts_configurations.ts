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
  await knex.schema.alterTable('amounts', function (table) {
    table.dropForeign(['configuration_id'])
    table.dropPrimary()
    table.dropColumn('configuration_id')
  })

  await knex.schema.alterTable('amounts', function (table) {
    table.string('configuration_id').notNullable()
    table.specificType('configuration_id', 'CHAR(12)').notNullable()
    table.primary(['configuration_id', 'timestamp'])
  })

  await knex.schema.dropTable('amounts_configurations')
}

export async function down(knex: Knex) {
  await knex.schema.createTable('amounts_configurations', function (table) {
    table.increments('id')
    table.string('indexer_id').notNullable()
    table.string('project_id').notNullable()
    table.string('chain').notNullable()
    table.string('address').notNullable()
    table.string('escrow_address').nullable()
    table.string('origin').notNullable()
    table.string('type').notNullable()
    table.boolean('include_in_total').notNullable()
    table.dateTime('since_timestamp_inclusive', { useTz: false }).notNullable()
    table.dateTime('until_timestamp_inclusive', { useTz: false }).nullable()

    table.primary(['id'])
    table.index(['indexer_id', 'project_id'])
  })

  await knex.schema.alterTable('amounts', function (table) {
    table.dropPrimary()
    table.dropColumn('configuration_id')
  })

  await knex.schema.alterTable('amounts', function (table) {
    table.integer('configuration_id').notNullable()
    table.primary(['configuration_id', 'timestamp'])
    table
      .foreign('configuration_id')
      .references('id')
      .inTable('amounts_configurations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}
