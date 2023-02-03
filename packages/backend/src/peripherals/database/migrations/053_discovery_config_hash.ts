/*
                      ====== IMPORTANT NOTICE ======
DO NOT EDIT OR RENAME THIS FILE
This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 
If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.
*/

import { Knex } from 'knex'

import { ConfigReader } from '../../../core/discovery/ConfigReader'
import { getDiscoveryConfigHash } from '../../../core/discovery/utils/getDiscoveryConfigHash'

export async function up(knex: Knex) {
  await knex.schema.alterTable('discovery_watcher', function (table) {
    table.string('config_hash').notNullable().defaultTo('')
  })

  const configReader = new ConfigReader()
  const configs = await configReader.readAllConfigs()

  await Promise.all(
    configs.map((config) => {
      const configHash = getDiscoveryConfigHash(config)
      return knex('discovery_watcher')
        .update({ config_hash: configHash.toString() })
        .where('project_name', config.name)
    }),
  )
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('discovery_watcher', function (table) {
    table.dropColumn('config_hash')
  })
}
