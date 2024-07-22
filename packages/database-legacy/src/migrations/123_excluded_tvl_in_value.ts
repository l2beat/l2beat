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
  await knex.schema.alterTable('value', function (table) {
    table.bigint('canonical_associated').notNullable().defaultTo(0)
    table.bigint('canonical_associated_for_total').notNullable().defaultTo(0)
    table.bigint('external_associated').notNullable().defaultTo(0)
    table.bigint('external_associated_for_total').notNullable().defaultTo(0)
    table.bigint('native_associated').notNullable().defaultTo(0)
    table.bigint('native_associated_for_total').notNullable().defaultTo(0)
  })
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('value', function (table) {
    table.dropColumn('canonical_associated')
    table.dropColumn('canonical_associated_for_total')
    table.dropColumn('external_associated')
    table.dropColumn('external_associated_for_total')
    table.dropColumn('native_associated')
    table.dropColumn('native_associated_for_total')
  })
}
