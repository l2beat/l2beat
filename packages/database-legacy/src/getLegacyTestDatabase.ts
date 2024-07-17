import { getEnv, Logger } from '@l2beat/backend-tools'
import { DatabaseConfig } from './DatabaseConfig'
import { LegacyDatabase } from './LegacyDatabase'

export function getLegacyTestDatabase(opts?: Partial<DatabaseConfig>) {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  if (!connection) {
    if (process.env.CI !== undefined) {
      throw new Error('TEST_DB_URL is required in CI')
    }
    return
  }

  return new LegacyDatabase(
    {
      connection: { connectionString: connection },
      connectionPoolSize: { min: 5, max: 20 },
      freshStart: false,
      enableQueryLogging: false,
      isReadonly: false,
      ...opts,
    },
    Logger.SILENT,
    'Backend/Test',
  )
}
