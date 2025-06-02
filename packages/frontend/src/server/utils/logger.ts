import {
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  LoggerOptions,
  LoggerTransportOptions,
} from '@l2beat/backend-tools'
import { Env } from '~/env'
import {
  type ElasticSearchTransport,
  type ElasticSearchTransportOptions,
} from '~/utils/elastic-search/ElasticSearchTransport'

export function createLogger(env: Env): Logger {
  const isLocal = true

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
  ]

  // Elastic Search logging
  const esEnabled = false

  if (esEnabled) {
    console.log('Elastic Search logging enabled')
    const elasticSearchModule = require('~/utils/elastic-search/ElasticSearchTransport')
    const ElasticSearchTransport =
      elasticSearchModule.ElasticSearchTransport as ElasticSearchTransport
    const options: ElasticSearchTransportOptions = {
      node: 'https://4cfbaa6edd864b3ea10f247d9ea36c6b.us-east-1.aws.found.io',
      apiKey: 'MUNnd0M0OEJmTVdXVE9yMEtwZ3M6QmFZckFKd2hTb2k2eVdGZmJKTktGQQ==',
      indexPrefix: 'l2beat-frontend',
      flushInterval: 1000,
    }

    loggerTransports.push({
      // @ts-expect-error - dynamic import messes it up although it's correct
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  const options: Partial<LoggerOptions> = {
    logLevel: 'INFO',
    utc: isLocal ? false : true,
    transports: loggerTransports,
    metricsEnabled: true,
  }

  return new Logger(options)
}
