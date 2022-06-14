import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.raw(
    'UPDATE reports SET balance=(SELECT asset_balances.balance FROM asset_balances WHERE asset_balances.block_number = reports.block_number AND asset_balances.asset_id = reports.asset_id AND asset_balances.holder_address = reports.bridge_address);',
  )

  await knex('reports')
    .update({ is_daily: true })
    .whereRaw('mod(reports.unix_timestamp,86400) = 0')
}

export async function down(knex: Knex) {
  await knex('reports').update({ balance: '0' })
  await knex('reports').update({ is_daily: false })
}
