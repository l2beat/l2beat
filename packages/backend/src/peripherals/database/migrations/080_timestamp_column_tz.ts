/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const dailyCountViewSchema = 'activity'
const dailyCountViewName = 'daily_count_view'
const dailyCountView = `${dailyCountViewSchema}.${dailyCountViewName}`

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
    })
    .whereIn('table_schema', ['public', 'activity'])) as ColumnInfo[]

  // get definition of activity.daily_count_view materialized view
  const dailyCountViewDefinition = (await knex('pg_matviews')
    .select('definition')
    .where({
      schemaname: dailyCountViewSchema,
      matviewname: dailyCountViewName,
    })) as { definition: string }[]

  // get definition of all indexes on activity.daily_count_view
  const dailyCountViewIndexes = (await knex('pg_indexes')
    .select('indexdef')
    .where({
      schemaname: dailyCountViewSchema,
      tablename: dailyCountViewName,
    })) as { indexdef: string }[]

  // drop materialized view since it's not possible to alter
  // a column type when it's used in a materialized view or a view
  await knex.raw(`DROP MATERIALIZED VIEW ${dailyCountView}`)

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

  // recreate materialized view
  await knex.raw(`
    CREATE MATERIALIZED VIEW ${dailyCountView} AS
      ${dailyCountViewDefinition[0].definition}`)

  // recreate indexes
  for (const index of dailyCountViewIndexes) {
    await knex.raw(index.indexdef)
  }

  // refresh materialized view
  await knex.raw(`REFRESH MATERIALIZED VIEW ${dailyCountView}`)
}

export async function down(_: Knex) {}
