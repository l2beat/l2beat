import { Logger, getEnv } from '@l2beat/backend-tools'
import { DatabaseConfig, LegacyDatabase } from '@l2beat/database-legacy'

async function main() {
  const env = getEnv()

  const config: DatabaseConfig = {
    connection: {
      connectionString: env.string('DEV_LOCAL_DB_URL'),
      ssl: !env.string('DEV_LOCAL_DB_URL').includes('localhost')
        ? { rejectUnauthorized: false }
        : undefined,
    },
    freshStart: false,
    enableQueryLogging: false,
    connectionPoolSize: { min: 2, max: 10 },
    isReadonly: false,
  }

  const database = new LegacyDatabase(config, Logger.SILENT, 'migration-script')

  await database.migrateToLatest()

  await database.closeConnection()

  console.log('DB migrated to latest')
}

main().catch((e: unknown) => {
  console.error(e)
})
