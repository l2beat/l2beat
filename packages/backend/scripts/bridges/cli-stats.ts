import { getEnv, Logger, type LoggerOptions } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { command, run } from 'cmd-ts'
import { writeFileSync } from 'fs'
import { CHAINS } from './chains'
import { Decoder } from './Decoder'
import { PROTOCOLS } from './protocols/protocols'
import type { Asset } from './types/Asset'

const cmd = command({
  name: 'bridges:cli-stats',
  args: {},
  handler: async (_) => {
    const logger = setupLogger()
    const chains = setupChains(CONFIG.chains, logger)
    const decoder = new Decoder(PROTOCOLS, chains, logger)

    const outbound: Map<string, Asset> = new Map()
    const inbound: Map<string, Asset> = new Map()
    const matching: Map<string, { outbound: Asset; inbound: Asset }> = new Map()

    const counts: Map<string, number> = new Map()
    const delays: Map<string, number[]> = new Map()

    const promises = []

    for (const chain of chains) {
      for (let block = chain.from; block <= chain.to; block++) {
        logger.info('Executing', {
          network: chain.name,
          blockNumber: block,
        })
        promises.push(
          (async () => {
            const { assets } = await decoder.executeMany(CONFIG.protocols, {
              name: chain.name,
              block: block,
            })

            for (const asset of assets) {
              logger.debug('Decoded', {
                protocol: asset.application,
                direction: asset.direction,
                network:
                  asset.direction === 'outbound'
                    ? asset.origin
                    : asset.destination,
              })
              if (asset.direction === 'outbound') {
                if (asset.matchingId === undefined) {
                  logger.warn('Missing matchingId')
                  continue
                }
                outbound.set(asset.matchingId, asset)

                const matchingInbound = inbound.get(asset.matchingId)
                if (matchingInbound) {
                  matching.set(asset.matchingId, {
                    outbound: asset,
                    inbound: matchingInbound,
                  })
                  counts.set(
                    asset.application,
                    (counts.get(asset.application) ?? 0) + 1,
                  )
                  const delay =
                    matchingInbound.blockTimestamp - asset.blockTimestamp
                  const previousDelays = delays.get(asset.application)
                  delays.set(
                    asset.application,
                    previousDelays ? [...previousDelays, delay] : [delay],
                  )

                  logger.info(`${asset.application} matched`, {
                    from: asset.origin,
                    to: asset.destination,
                    amount: asset.amount,
                    delay,
                  })

                  logger.info(`${asset.application} stats`, {
                    count: counts.get(asset.application),
                    averageDelay: average(delays.get(asset.application) ?? []),
                    medianDelay: median(delays.get(asset.application) ?? []),
                  })
                }
              }
              if (asset.direction === 'inbound') {
                if (asset.matchingId === undefined) {
                  logger.warn('Missing matchingId')
                  continue
                }
                inbound.set(asset.matchingId, asset)

                const matchingOutbound = outbound.get(asset.matchingId)
                if (matchingOutbound) {
                  matching.set(asset.matchingId, {
                    outbound: matchingOutbound,
                    inbound: asset,
                  })
                  counts.set(
                    asset.application,
                    (counts.get(asset.application) ?? 0) + 1,
                  )
                  const delay =
                    asset.blockTimestamp - matchingOutbound.blockTimestamp
                  const previousDelays = delays.get(asset.application)
                  delays.set(
                    asset.application,
                    previousDelays ? [...previousDelays, delay] : [delay],
                  )

                  logger.info(`${asset.application} matched`, {
                    from: asset.origin,
                    to: asset.destination,
                    amount: asset.amount,
                    delay,
                  })

                  logger.info(`${asset.application} stats`, {
                    count: counts.get(asset.application),
                    averageDelay: average(delays.get(asset.application) ?? []),
                    medianDelay: median(delays.get(asset.application) ?? []),
                  })
                }
              }
            }
          })(),
        )
      }
    }

    await Promise.all(promises)

    console.log('COUNTS')
    console.log(counts)
    console.log('DELAYS')
    console.log(delays)

    writeFileSync(
      './matching.csv',
      Array.from(matching.entries())
        .map(
          ([id, { outbound, inbound }]) =>
            `${outbound.application};${outbound.amount};${inbound.blockTimestamp - outbound.blockTimestamp}${id};`,
        )
        .join('\n'),
    )
  },
})

function setupLogger() {
  return Logger.INFO.configure({
    logLevel:
      (getEnv().string('LOG_LEVEL') as LoggerOptions['logLevel']) ?? 'INFO',
  })
}

function setupChains(
  chainsConfig: { name: string; from: number; to: number }[],
  logger: Logger,
) {
  const http = new HttpClient()
  const env = getEnv()

  const chains = chainsConfig.map(({ name, from, to }) => {
    const chain = CHAINS.find((c) => c.name === name)
    assert(chain, `${name}: Chain not found`)

    return {
      ...chain,
      from,
      to,
      rpc: new RpcClient({
        url: env.string(`${chain.name.toUpperCase()}_RPC_URL`),
        sourceName: chain.name,
        http,
        logger,
        callsPerMinute: chain.rpcCallsPerMinute,
        retryStrategy: 'SCRIPT',
      }),
    }
  })
  return chains
}

run(cmd, process.argv.slice(2))

const CONFIG: {
  chains: { name: string; from: number; to: number }[]
  protocols: string[]
} = {
  chains: [
    {
      name: 'ethereum',
      from: 23087218,
      to: 23088218,
    },
    {
      name: 'arbitrum',
      from: 365871936,
      to: 365873936,
    },
    {
      name: 'base',
      from: 33883542,
      to: 33885542,
    },
  ],
  protocols: ['across'],
}

const average = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length
function median(numbers: number[]) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
