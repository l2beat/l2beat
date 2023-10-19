/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

interface ColumnInfo {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
}

export async function up(knex: Knex) {
  // get all columns that are of type timestamp with time zone
  const columns = (await knex('information_schema.columns')
    .select(
      'table_catalog',
      'table_schema',
      'table_name',
      'column_name',
      'data_type',
    )
    .where({
      data_type: 'timestamp with time zone',
      table_schema: 'public',
    })) as ColumnInfo[]

  for (const column of columns) {
    const { table_name, column_name, table_schema } = column
    if (table_name === 'knex_migrations') continue

    // https://www.postgresql.org/docs/14/sql-altertable.html
    // Indexes and simple table constraints involving the column will be automatically converted
    // to use the new column type by reparsing the originally supplied expression.

    // get list of indexes table is involved in
    await knex.raw(
      `ALTER TABLE "${table_schema}"."${table_name}" ALTER COLUMN ${column_name}
        SET DATA TYPE timestamp without time zone USING ${column_name}::timestamp without time zone`,
    )
  }
}

export async function down(_: Knex) {}
