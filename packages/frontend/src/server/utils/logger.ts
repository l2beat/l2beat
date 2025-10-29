import {
  ConsoleTransport,
  Logger,
  type LoggerOptions,
  type LoggerTransport,
} from '@l2beat/backend-tools'
import { env } from '~/env'
import type { ElasticSearchTransportOptions } from '~/utils/elastic-search/ElasticSearchTransport'

let logger: Logger | undefined

/**
 * Gets the singleton Logger instance. Creates a new instance on first call,
 * then returns the cached instance on subsequent calls.
 */
export function getLogger(): Logger {
  if (logger) {
    return logger
  }

  const isLocal = env.NODE_ENV !== 'production'

  const loggerTransports: LoggerTransport[] = [
    isLocal ? ConsoleTransport.PRETTY : ConsoleTransport.JSON,
  ]

  if (env.ES_ENABLED) {
    console.log('Elastic Search logging enabled')

    if (!env.ES_NODE || !env.ES_API_KEY || !env.ES_INDEX_PREFIX) {
      throw new Error('ES_NODE, ES_API_KEY, and ES_INDEX_PREFIX must be set')
    }

    const {
      ElasticSearchTransport,
    } = require('~/utils/elastic-search/ElasticSearchTransport')
    const options: ElasticSearchTransportOptions = {
      node: env.ES_NODE,
      apiKey: env.ES_API_KEY,
      indexPrefix: env.ES_INDEX_PREFIX,
      flushInterval: env.ES_FLUSH_INTERVAL,
    }

    loggerTransports.push(new ElasticSearchTransport(options))
  }

  const options: Partial<LoggerOptions> = {
    level: env.LOG_LEVEL,
    transports: loggerTransports,
  }

  logger = new Logger(options)
  return logger
}
