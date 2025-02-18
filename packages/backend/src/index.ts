import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  type LoggerOptions,
  type LoggerTransportOptions,
  getEnv,
} from '@l2beat/backend-tools'

import { Application } from './Application'
import { getConfig } from './config'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const environment = getEnv().optionalString('DEPLOYMENT_ENV') ?? 'local'

  const logger = createLogger(environment)

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

function createLogger(environment: string): Logger {
  const isLocal = environment === 'local'

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
  ]

  // Elastic Search logging
  const esEnabled = getEnv().optionalBoolean('ES_ENABLED') ?? false

  if (esEnabled) {
    console.log('Elastic Search logging enabled')
    const options: ElasticSearchTransportOptions = {
      node: getEnv().string('ES_NODE'),
      apiKey: getEnv().string('ES_API_KEY'),
      indexPrefix: getEnv().string('ES_INDEX_PREFIX'),
      flushInterval: getEnv().optionalInteger('ES_FLUSH_INTERVAL'),
    }

    loggerTransports.push({
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  const options: Partial<LoggerOptions> = {
    logLevel: getEnv().string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
    utc: isLocal ? false : true,
    transports: loggerTransports,
  }

  return new Logger(options)
}
