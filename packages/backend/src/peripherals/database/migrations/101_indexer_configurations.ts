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
  // Get rid of amounts-specific configuration table
  await knex.schema.alterTable('amounts', function (table) {
    table.dropForeign(['configuration_id'])
    table.dropPrimary()
    table.dropColumn('configuration_id')
  })
  await knex.schema.dropTable('amounts_configurations')

  // Create generic configurations table
  await knex.schema.createTable('indexer_configurations', function (table) {
    // Hash collision probability for 1M configurations for 6-byte hash is 0.1776%
    table.specificType('id', 'CHAR(12)').notNullable()
    table.string('indexer_id').notNullable()
    table.integer('current_height').nullable()
    table.integer('min_height').notNullable()
    table.integer('max_height').nullable()
    table.string('properties').notNullable()

    table.primary(['id'])
    table.index(['indexer_id'])
  })

  // Reference generic configurations from amounts
  await knex.schema.alterTable('amounts', function (table) {
    table.specificType('configuration_id', 'CHAR(12)').notNullable()
    table.primary(['configuration_id', 'timestamp'])
    table
      .foreign('configuration_id')
      .references('id')
      .inTable('indexer_configurations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex) {
  // Remove generic configurations table
  await knex.schema.alterTable('amounts', function (table) {
    table.dropForeign(['configuration_id'])
    table.dropPrimary()
    table.dropColumn('configuration_id')
  })
  await knex.schema.dropTable('indexer_configurations')

  // Create amounts-specific configuration table
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

  // Reference amounts-specific configurations from amounts
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
