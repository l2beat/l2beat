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
  await knex.schema.table('reports', (table) => {
    table.renameColumn('asset_type', 'report_type')
  })
  await knex.schema.table('reports_status', (table) => {
    table.renameColumn('asset_type', 'report_type')
  })
  await knex.schema.table('aggregated_reports', (table) => {
    table.renameColumn('value_type', 'report_type')
  })
}

export async function down(knex: Knex) {
  await knex.schema.table('reports', (table) => {
    table.renameColumn('report_type', 'asset_type')
  })
  await knex.schema.table('reports_status', (table) => {
    table.renameColumn('report_type', 'asset_type')
  })
  await knex.schema.table('aggregated_reports', (table) => {
    table.renameColumn('report_type', 'value_type')
  })
}
