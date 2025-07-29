import {
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  type LoggerOptions,
  type LoggerTransportOptions,
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

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
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

    loggerTransports.push({
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  const options: Partial<LoggerOptions> = {
    logLevel: 'INFO',
    utc: isLocal ? false : true,
    transports: loggerTransports,
    // TODO: make this configurable
    metricsEnabled: false,
  }

  logger = new Logger(options)
  return logger
}
