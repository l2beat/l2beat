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
  await knex.schema.raw('DROP SCHEMA transactions CASCADE')
}

export async function down(knex: Knex) {
  await knex.schema.raw('CREATE SCHEMA transactions')

  await knex.schema
    .withSchema('transactions')
    .createTable('block', (table) => {
      table.string('project_id').notNullable()
      table.dateTime('unix_timestamp', { useTz: false })
      table.integer('count').notNullable()
      table.integer('block_number').notNullable()
      table.primary(['project_id', 'block_number'])
    })
    .createTable('zksync', (table) => {
      table.integer('block_number').notNullable()
      table.integer('block_index').notNullable()
      table.dateTime('unix_timestamp', { useTz: false })
      table.primary(['block_number', 'block_index'])
    })
    .createTable('starkex', (table) => {
      table.string('project_id').notNullable()
      table.dateTime('unix_timestamp', { useTz: false })
      table.integer('count').notNullable()
      table.primary(['project_id', 'unix_timestamp'])
    })
    .createTable('block_tip', (table) => {
      table.string('project_id').primary()
      table.dateTime('unix_timestamp', { useTz: false })
      table.integer('block_number').notNullable()
    })
    .createTable('zksync_tip', function (table) {
      table.dateTime('unix_timestamp', { useTz: false })
      table.integer('block_number').notNullable()
      table.integer('block_index').notNullable()
    })

  await knex.schema.raw(
    `
    CREATE MATERIALIZED VIEW transactions.zksync_count_view AS
      SELECT
        date_trunc('day', zksync.unix_timestamp) unix_timestamp,
        count(*) count
      FROM transactions.zksync zksync
      INNER JOIN transactions.block_tip tip ON tip.project_id = 'zksync'
      WHERE zksync.unix_timestamp < date_trunc('day', tip.unix_timestamp)
      GROUP BY date_trunc('day', zksync.unix_timestamp)
  `,
  )
  await knex.schema.raw(`
    CREATE MATERIALIZED VIEW transactions.block_count_view AS
      SELECT
        block.project_id,
        date_trunc('day', block.unix_timestamp) unix_timestamp,
        sum(block.count) count
      FROM transactions.block block
      INNER JOIN transactions.block_tip tip ON block.project_id = tip.project_id
      WHERE block.unix_timestamp < date_trunc('day', tip.unix_timestamp)
      GROUP BY block.project_id, date_trunc('day', block.unix_timestamp)
  `)
  await knex.schema.raw(`
    CREATE UNIQUE INDEX block_count_view_unique_idx
    ON transactions.block_count_view (project_id, unix_timestamp)`)
  await knex.schema.raw(`
    CREATE UNIQUE INDEX zksync_count_view_unique_idx
    ON transactions.zksync_count_view (unix_timestamp)`)
}
