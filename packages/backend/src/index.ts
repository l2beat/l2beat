import {
  type Env,
  getEnv,
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  type LoggerOptions,
  type LoggerTransportOptions,
} from '@l2beat/backend-tools'
import apm from 'elastic-apm-node'
import { Application } from './Application'
import { getConfig } from './config'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
} from './peripherals/elastic-search/ElasticSearchTransport'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const env = getEnv()

  const logger = createLogger(env)

  apm.start({
    active: process.env.ES_APM_ENABLED === 'true',
    environment: env.optionalString('DEPLOYMENT_ENV') ?? 'local',
    secretToken: process.env.ES_APM_SECRET_TOKEN ?? '',
    serverUrl: process.env.ES_APM_SERVER_URL ?? 'http://localhost:8200',
    serviceName: process.env.ES_APM_SERVICE_NAME ?? 'l2beat-local',
  })

  try {
    const config = await getConfig()
    const app = new Application(config, logger)
    await app.start()
  } catch (e) {
    logger.critical('Failed to start the application', e)

    // wait 10 seconds for the error to be reported
    console.log('Waiting 10 seconds for the error to be reported')
    await new Promise((resolve) => setTimeout(resolve, 10000))

    throw e
  }
}

function createLogger(env: Env): Logger {
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
