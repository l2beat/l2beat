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
  await knex.raw(
    'UPDATE reports SET balance=(SELECT asset_balances.balance FROM asset_balances WHERE asset_balances.block_number = reports.block_number AND asset_balances.asset_id = reports.asset_id AND asset_balances.holder_address = reports.bridge_address);',
  )

  await knex('reports')
    // @ts-expect-error-next-line
    .update({ is_daily: true })
    .whereRaw('mod(reports.unix_timestamp,86400) = 0')
}

export async function down(knex: Knex) {
  // @ts-expect-error-next-line
  await knex('reports').update({ balance: '0' })
  // @ts-expect-error-next-line
  await knex('reports').update({ is_daily: false })
}
