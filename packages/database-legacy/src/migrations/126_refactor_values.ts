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
  // Dropping the table as there are so many changes it's just easier to just recreate it
  // As it's a new table I'm using prisma conventions for the column names and TypeScript convention for enum

  // TODO: Confirm we can safely drop the table (!!!)

  await knex.schema.dropTable('values')
  await knex.schema.createTable('values', function (table) {
    table.increments('id').primary()
    table.string('projectId').notNullable()
    table.string('dataSource').notNullable()
    table.timestamp('timestamp').notNullable()
    table
      .enum('type', ['Total', 'Associated', 'Ether', 'Stablecoin', 'Other'])
      .notNullable()
    table.boolean('forTotal').notNullable()
    table.bigint('native').notNullable()
    table.bigint('canonical').notNullable()
    table.bigint('external').notNullable()

    table.unique(['timestamp', 'project_id', 'data_source', 'type'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('values')
  await knex.schema.createTable('values', function (table) {
    table.string('project_id').notNullable()
    table.string('data_source').notNullable()
    table.timestamp('timestamp').notNullable()
    table.bigint('canonical').notNullable()
    table.bigint('canonical_for_total').notNullable()
    table.bigint('canonical_associated').notNullable().defaultTo(0)
    table.bigint('canonical_associated_for_total').notNullable().defaultTo(0)
    table.bigint('external').notNullable()
    table.bigint('external_for_total').notNullable()
    table.bigint('external_associated').notNullable().defaultTo(0)
    table.bigint('external_associated_for_total').notNullable().defaultTo(0)
    table.bigint('native').notNullable()
    table.bigint('native_for_total').notNullable()
    table.bigint('native_associated').notNullable().defaultTo(0)
    table.bigint('native_associated_for_total').notNullable().defaultTo(0)

    table.primary(['timestamp', 'project_id', 'data_source'])
  })
}
