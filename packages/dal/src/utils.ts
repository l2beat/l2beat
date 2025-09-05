import { getEnv, LogFormatterPretty, Logger } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import { Cache } from './cache/Cache'

export function getDb() {
  const env = getEnv()
  const tvsDbUrl = env.string('DB_URL')

  return createDatabase({
    connectionString: tvsDbUrl,
    application_name: 'DAL-POC',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 10,
    keepAlive: false,
  })
}

export function getCache() {
  const env = getEnv()
  const redisUrl = env.string('REDIS_URL')
  return new Cache(redisUrl)
}

export function getLogger() {
  const logger = new Logger({
    logLevel: 'INFO',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
  return logger
}
