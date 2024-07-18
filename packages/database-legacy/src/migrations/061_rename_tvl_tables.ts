/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

const changes = [
  {
    oldName: 'asset_balances',
    newName: 'balances',
    indexes: ['pkey'],
  },
  {
    oldName: 'balance_status',
    newName: 'balances_status',
    indexes: ['pkey', 'config_hash_index', 'unix_timestamp_index'],
  },
  {
    oldName: 'report_status',
    newName: 'reports_status',
    indexes: ['pkey', 'config_hash_index', 'unix_timestamp_index'],
  },
  {
    oldName: 'aggregate_reports',
    newName: 'aggregated_reports',
    indexes: [
      'pkey',
      'is_daily_index',
      'is_six_hourly_index',
      'project_id_index',
    ],
  },
]

export async function up(knex: Knex) {
  for (const change of changes) {
    await knex.schema.renameTable(change.oldName, change.newName)

    for (const index of change.indexes) {
      await renameIndex(knex, index, change.oldName, change.newName)
    }
  }
}

export async function down(knex: Knex) {
  for (const change of changes) {
    await knex.schema.renameTable(change.newName, change.oldName)

    for (const index of change.indexes) {
      await renameIndex(knex, index, change.newName, change.oldName)
    }
  }
}

async function renameIndex(
  knex: Knex,
  index: string,
  oldTableName: string,
  newTableName: string,
) {
  await knex.raw('ALTER INDEX ?? RENAME TO ??;', [
    `${oldTableName}_${index}`,
    `${newTableName}_${index}`,
  ])
}
