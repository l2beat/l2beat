/*
                      ====== IMPORTANT NOTICE ======
DO NOT EDIT OR RENAME THIS FILE
This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 
If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.
*/

import { ConfigReader } from '@l2beat/discovery'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.alterTable('discovery_watcher', function (table) {
    table.string('config_hash').notNullable().defaultTo('')
  })

  const configReader = new ConfigReader()
  const configs = await configReader.readAllConfigs()

  await Promise.all(
    configs.map((config) => {
      return knex('discovery_watcher')
        .update({ config_hash: config.hash.toString() })
        .where('project_name', config.name)
    }),
  )
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('discovery_watcher', function (table) {
    table.dropColumn('config_hash')
  })
}
