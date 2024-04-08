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

  await knex.schema.alterTable('amounts', function (table) {
    table
      .foreign('configuration_id')
      .references('id')
      .inTable('indexer_configurations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('amounts', function (table) {
    table.dropForeign(['configuration_id'])
  })
  await knex.schema.dropTable('indexer_configurations')
}
