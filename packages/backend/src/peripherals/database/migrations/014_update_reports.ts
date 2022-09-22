/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { layer2s } from '@l2beat/config'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('reports', (table) => {
    table.string('project_id')
  })
  await Promise.all(
    layer2s.flatMap(({ id, config: { escrows } }) =>
      escrows.map(async (escrow) => {
        await knex('reports')
          .update({ project_id: id.toString() })
          // @ts-expect-error bridge_address removed from knex module type
          .where({ bridge_address: escrow.address })
      }),
    ),
  )

  await knex.schema.createTable('reports_tmp', (table) => {
    table.bigInteger('unix_timestamp').notNullable()
    table.string('project_id').notNullable()
    table.string('asset_id').notNullable()
    table.decimal('balance', 80, 0).notNullable()
    table.decimal('balance_usd', 80, 0).notNullable()
    table.decimal('balance_eth', 80, 0).notNullable()
    table.boolean('is_daily').notNullable()
    table.primary(['unix_timestamp', 'project_id', 'asset_id'])
  })

  await knex.raw(`
    INSERT INTO reports_tmp (unix_timestamp, project_id, asset_id, balance, balance_usd, balance_eth, is_daily)
    SELECT unix_timestamp, project_id, asset_id, SUM(balance) balance, SUM(usd_tvl) balance_usd, SUM(eth_tvl) balance_eth, is_daily
    FROM reports
    GROUP BY unix_timestamp, project_id, asset_id, is_daily
  `)

  await knex.schema.renameTable('reports', 'reports_old')
  await knex.schema.renameTable('reports_tmp', 'reports')
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('reports')
  await knex.schema.renameTable('reports_old', 'reports')
  await knex.schema.alterTable('reports', (table) => {
    table.dropColumn('project_id')
  })
}
