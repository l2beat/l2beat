/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const table_schema = 'public'
const tableColumnToUpdate: Record<string, [string, ...string[]]> = {
  circulating_supplies: ['unix_timestamp'],
  total_supplies: ['unix_timestamp'],
  total_supplies_status: ['unix_timestamp'],
  update_notifier: ['updated_at', 'created_at'],
}

export async function up(knex: Knex) {
  for (const [table_name, columns] of Object.entries(tableColumnToUpdate)) {
    for (const column of columns) {
      await knex.raw(
        `ALTER TABLE "${table_schema}"."${table_name}" ALTER COLUMN ${column}
        SET DATA TYPE timestamp without time zone USING ${column}::timestamp without time zone`,
      )
    }
  }
}

export async function down(knex: Knex) {
  for (const [table_name, columns] of Object.entries(tableColumnToUpdate)) {
    for (const column of columns) {
      await knex.raw(
        `ALTER TABLE "${table_schema}"."${table_name}" ALTER COLUMN ${column}
        SET DATA TYPE timestamp with time zone USING ${column}::timestamp with time zone`,
      )
    }
  }
}
