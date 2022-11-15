/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const startOfDay = `date_trunc('day', unix_timestamp)`
const schema = 'activity_v2'
const zksyncTable = 'zksync'
const blockTable = 'block'
const starkexTable = 'starkex'
const dailyCountView = 'daily_count_view'

export async function up(knex: Knex) {
  await knex.schema.createSchema(schema)
  await knex.schema
    .withSchema(schema)
    .createTable(zksyncTable, function (table) {
      table.integer('block_number').notNullable()
      table.integer('block_index').notNullable()
      table.dateTime('unix_timestamp', { useTz: false }).notNullable()
      table.primary(['block_number', 'block_index'])
    })
  await knex.schema
    .withSchema(schema)
    .createTable(blockTable, function (table) {
      table.string('project_id').notNullable()
      table.dateTime('unix_timestamp', { useTz: false }).notNullable()
      table.integer('count').notNullable()
      table.integer('block_number').notNullable()
      table.primary(['project_id', 'block_number'])
    })
  await knex.schema
    .withSchema(schema)
    .createTable(starkexTable, function (table) {
      table.string('project_id').notNullable()
      table.dateTime('unix_timestamp', { useTz: false }).notNullable()
      table.integer('count').notNullable()
      table.primary(['project_id', 'unix_timestamp'])
    })
  await knex.schema.raw(
    `
    CREATE MATERIALIZED VIEW ${schema}.${dailyCountView} AS
      SELECT 'zksync' as project_id, ${startOfDay} unix_timestamp, count(*) count
      FROM ${schema}.${zksyncTable}
      GROUP BY ${startOfDay}
      UNION
      SELECT project_id, ${startOfDay} unix_timestamp, sum(count) count
      FROM ${schema}.${blockTable}
      GROUP BY ${startOfDay}, project_id
      UNION
      SELECT project_id, unix_timestamp, count FROM ${schema}.${starkexTable}
  `,
  )
  await knex.schema.raw(
    `CREATE UNIQUE INDEX ${dailyCountView}_unique_idx ON ${schema}.${dailyCountView} (project_id, unix_timestamp)`,
  )
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema(schema)
    .dropMaterializedView(dailyCountView)
    .dropTable(zksyncTable)
    .dropTable(blockTable)
    .dropTable(starkexTable)
  await knex.schema.dropSchema(schema)
}
