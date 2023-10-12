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

    // ChatGTP! 2023-10-11
    // Altering a column directly in PostgreSQL does not inherently result in data loss. However, it's important to exercise caution and consider the potential impact on your data when altering column types.
    //
    // When altering a column type, PostgreSQL will attempt to perform a type conversion for each existing value in the column. If the conversion is not possible due to incompatible data or constraints, an error may occur, and data loss could potentially happen.
    //
    // To minimize the risk of data loss, it's recommended to follow best practices:
    //
    // 1. Backup your database before making any alterations to critical columns.
    // 2. Test the alteration on a non-production environment or a copy of the database first.
    // 3. Ensure that the new column type is compatible with the data and any constraints or dependencies.
    // 4. Consider any potential implications on queries, application logic, and data integrity.

    const tempColumnName = `${column.column_name}_temp`

    await knex.raw(
      `ALTER TABLE "${table_schema}.${table_name}" ADD COLUMN ${tempColumnName} timestamp without time zone;`,
    )
    await knex.raw(
      `UPDATE "${table_schema}.${table_name}" SET ${tempColumnName} = ${column_name};`,
    )
    await knex.raw(
      `ALTER TABLE "${table_schema}.${table_name}" DROP COLUMN ${column_name};`,
    )
    await knex.raw(
      `ALTER TABLE "${table_schema}.${table_name}" RENAME COLUMN ${tempColumnName} TO ${column_name};`,
    )
  }
}

export async function down(knex: Knex) {}
