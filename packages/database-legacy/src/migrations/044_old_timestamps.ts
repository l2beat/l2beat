/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

import * as reportIndices from './021_speed_up_reports'

export async function up(knex: Knex) {
  await reportIndices.down(knex)

  await updateToTimestamp(knex, 'block_numbers')
  await updateToTimestamp(knex, 'coingecko_prices')
  await updateToTimestamp(knex, 'asset_balances')
  await updateToTimestamp(knex, 'aggregate_reports')
  await updateToTimestamp(knex, 'report_status')
  await updateToTimestamp(knex, 'balance_status')
  await updateToTimestamp(knex, 'reports')
}

export async function down(knex: Knex) {
  await downgradeToBigint(knex, 'block_numbers')
  await downgradeToBigint(knex, 'coingecko_prices')
  await downgradeToBigint(knex, 'asset_balances')
  await downgradeToBigint(knex, 'aggregate_reports')
  await downgradeToBigint(knex, 'report_status')
  await downgradeToBigint(knex, 'balance_status')
  await downgradeToBigint(knex, 'reports')

  await reportIndices.up(knex)
}

async function updateToTimestamp(knex: Knex, table: string) {
  await knex.schema.raw(
    `
    ALTER TABLE ${table}
      ALTER COLUMN unix_timestamp TYPE timestamp 
      USING timestamp 'epoch' + unix_timestamp * interval '1 second'
    `,
  )
}

async function downgradeToBigint(knex: Knex, table: string) {
  await knex.schema.raw(
    `
    ALTER TABLE ${table} 
      ALTER COLUMN unix_timestamp TYPE bigint 
      USING extract(epoch FROM unix_timestamp)
    `,
  )
}
