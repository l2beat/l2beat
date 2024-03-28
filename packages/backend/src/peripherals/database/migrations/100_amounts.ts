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
    // TODO: should it be exclusive? maybe if both were inclusive it would be more readable?
    table.dateTime('until_timestamp_inclusive', { useTz: false }).nullable()

    table.primary(['id'])
    table.index(['indexer_id', 'project_id'])
  })

  await knex.schema.createTable('amounts', function (table) {
    table.integer('configuration_id').unsigned().notNullable()
    table.dateTime('timestamp', { useTz: false }).notNullable()
    // The selection of "80" is a conservative choice to ensure
    // that any value that could be represented in uint256 variable in Solidity can be stored
    // without loss of precision, given that 2^256 is approximately 10^77.
    table.decimal('amount', 80, 0).notNullable()

    // Currently there is 15k configurations and 2k timestamps,
    // configurations will grow faster than timestamps.
    // Checking configuration_id first will eliminate more rows,
    // significantly reducing the number of rows to check for timestamp.
    table.primary(['configuration_id', 'timestamp'])

    // Foreign key will allow us to delete all amounts for a configuration
    // using a single query.
    table
      .foreign('configuration_id')
      .references('id')
      .inTable('amounts_configurations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('amounts')
  await knex.schema.dropTable('amounts_configurations')
}
