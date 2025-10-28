import {
  type Env,
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  type LoggerOptions,
  type LoggerTransportOptions,
} from '@l2beat/backend-tools'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
} from './elastic-search/ElasticSearchTransport'

export function createLogger(env: Env): Logger {
  const isLocal = env.optionalString('DEPLOYMENT_ENV') === undefined

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
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

    loggerTransports.push({
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  const options: Partial<LoggerOptions> = {
    logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
    utc: isLocal ? false : true,
    transports: loggerTransports,
    metricsEnabled: env.boolean('CLIENT_METRICS_ENABLED', esEnabled),
  }

  return new Logger(options)
}
