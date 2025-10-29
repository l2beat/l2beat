import {
  ConsoleTransport,
  getEnv,
  Logger,
  type LoggerOptions,
  type LoggerTransport,
  MetricsAggregator,
} from '@l2beat/backend-tools'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
} from './elastic-search/ElasticSearchTransport'

let logger: Logger | undefined

export function getLogger(): Logger {
  if (logger) {
    return logger
  }
  const env = getEnv()
  const isLocal = env.optionalString('DEPLOYMENT_ENV') === undefined

  const loggerTransports: LoggerTransport[] = [
    isLocal ? ConsoleTransport.PRETTY : ConsoleTransport.JSON,
  ]

  // Elastic Search logging
  const esEnabled = env.optionalBoolean('ES_ENABLED') ?? false

  if (esEnabled) {
    console.log('Elastic Search logging enabled')
    const options: ElasticSearchTransportOptions = {
      node: env.string('ES_NODE'),
      apiKey: env.string('ES_API_KEY'),
      indexPrefix: env.string('ES_INDEX_PREFIX'),
      flushInterval: env.optionalInteger('ES_FLUSH_INTERVAL'),
    }

    loggerTransports.push(new ElasticSearchTransport(options))
  }

  const options: Partial<LoggerOptions> = {
    level: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['level'],
    transports: loggerTransports,
  }

  const metricsEnabled = env.boolean('CLIENT_METRICS_ENABLED', esEnabled)
  MetricsAggregator.setMetricsEnabled(metricsEnabled)

  return new Logger(options)
}
