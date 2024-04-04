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
    table.string('id').notNullable()
    table.string('indexer_id').notNullable()
    table.string('properties').notNullable()

    table.integer('current_height').nullable()
    table.integer('min_height').notNullable()
    table.integer('max_height').nullable()

    // We do not create composite primary key because we want DB to enforce uniqueness
    // IDs will be generated in the runtime, so in case of collision the DB constraint will throw
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
