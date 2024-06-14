import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('CurrentPrice', function (table) {
    table.string('coingeckoId', 255).notNullable()
    table.float('priceUsd').notNullable()
    table.dateTime('updatedAt', { useTz: false }).notNullable()
    table.primary(['coingeckoId'], {
      constraintName: 'CurrentPrice_pkey',
    })
  })

  await knex.schema.createTable('Stake', function (table) {
    table.integer('chainId').notNullable()
    table.float('totalStake').notNullable()
    table.float('thresholdStake').notNullable()
    table.primary(['chainId'], {
      constraintName: 'Stake_pkey',
    })
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('CurrentPrice')
  await knex.schema.dropTable('Stake')
}
