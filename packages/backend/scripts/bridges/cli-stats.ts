// TODO: add envio

import { getEnv, Logger, type LoggerOptions } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { command, run } from 'cmd-ts'
import { writeFileSync } from 'fs'
import readline from 'readline'
import { CHAINS, type Chain } from './chains'
import { Decoder } from './Decoder'
import { PROTOCOLS } from './protocols/protocols'

import type { Asset } from './types/Asset'

function askQuestion(
  chains: (Chain & { from: number; to: number })[],
  protocols: string[],
  logger: Logger,
): Promise<string> {
  let maxEstimatedTime = 0
  let rpcCalls = 0

  logger.info('Configured decoders', { protocols })

  chains.forEach((chain) => {
    const range = chain.to - chain.from
    rpcCalls += range
    const estimatedTime = Math.ceil(
      (chain.to - chain.from) / chain.rpcCallsPerMinute,
    )
    maxEstimatedTime = Math.max(maxEstimatedTime, estimatedTime)

    logger.info(`${chain.name} config`, {
      from: chain.from,
      to: chain.to,
      range,
      estimatedFetchingTimeInMinutes: estimatedTime,
    })
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  logger.info(
    `Script will make ~${rpcCalls} RPC calls and take ~${maxEstimatedTime} minutes`,
  )
  logger.info(
    'Output will be saved continuously to ./scripts/bridges/matching.csv (File will be cleared in the beginning)',
  )

  return new Promise((resolve) =>
    rl.question('Do you want to run the script? [yes] ', (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
}

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

    const transfers: Map<string, Asset[]> = new Map()
    const delays: Map<string, number[]> = new Map()

    const promises = []

    const answer = await askQuestion(chains, CONFIG.protocols, logger)
    if (answer.toLowerCase() !== 'yes') {
      logger.error('Execution aborted')
      return
    }

    logger.info(
      `Running script for configured protocols [${CONFIG.protocols.length}]`,
      { protocols: CONFIG.protocols },
    )

    const BATCH_SIZE = 100

    for (const chain of chains) {
      promises.push(
        (async () => {
          for (let start = chain.from; start <= chain.to; start += BATCH_SIZE) {
            logger.info(`[${chain.name}] Processing batch`, {
              from: start,
              to: Math.min(start + BATCH_SIZE, chain.to),
              status:
                (
                  ((start - chain.from) * 100) /
                  (chain.to - chain.from)
                ).toFixed(2) + '%',
            })
            try {
              const { assets } = await decoder.executeMany(CONFIG.protocols, {
                name: chain.name,
                from: start,
                to: Math.min(start + BATCH_SIZE, chain.to),
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
                    logger.debug(`${asset.application} matched`, {
                      from: asset.origin,
                      to: asset.destination,
                      amount: asset.amount,
                      delay:
                        matchingInbound.blockTimestamp - asset.blockTimestamp,
                    })

                    matching.set(asset.matchingId, {
                      outbound: asset,
                      inbound: matchingInbound,
                    })
                    saveMatchingToFile(matching)
                    const previousTransfers = transfers.get(asset.application)
                    transfers.set(
                      asset.application,
                      previousTransfers
                        ? [...previousTransfers, asset]
                        : [asset],
                    )
                    const delay =
                      matchingInbound.blockTimestamp - asset.blockTimestamp
                    if (delay === 0) continue
                    const previousDelays = delays.get(asset.application)
                    delays.set(
                      asset.application,
                      previousDelays ? [...previousDelays, delay] : [delay],
                    )
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
                    logger.debug(`${asset.application} matched`, {
                      from: asset.origin,
                      to: asset.destination,
                      amount: asset.amount,
                      delay:
                        asset.blockTimestamp - matchingOutbound.blockTimestamp,
                    })

                    matching.set(asset.matchingId, {
                      outbound: matchingOutbound,
                      inbound: asset,
                    })
                    saveMatchingToFile(matching)
                    const previousTransfers = transfers.get(asset.application)
                    transfers.set(
                      asset.application,
                      previousTransfers
                        ? [...previousTransfers, asset]
                        : [asset],
                    )

                    const delay =
                      asset.blockTimestamp - matchingOutbound.blockTimestamp
                    if (delay === 0) continue
                    const previousDelays = delays.get(asset.application)
                    delays.set(
                      asset.application,
                      previousDelays ? [...previousDelays, delay] : [delay],
                    )
                  }
                }
              }
            } catch (_) {
              throw new Error(
                `[${chain.name}] Failed batch <${start},${Math.min(start + BATCH_SIZE, chain.to)}>`,
              )
            }
          }
        })(),
      )
    }

    await Promise.allSettled(promises).then((results) => {
      const failedPromises = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason)

      if (failedPromises.length > 0)
        console.log('Failed batches:', failedPromises)
    })

    for (const protocol of CONFIG.protocols) {
      const cc = transfers.get(protocol)
      if (!cc) continue
      const dd = delays.get(protocol)
      if (!dd) continue

      logger.info(`${protocol} stats`, {
        transfers: {
          count: cc.length,
          outbound: cc.filter((x) => x.direction === 'outbound').length,
          inbound: cc.filter((x) => x.direction === 'inbound').length,
        },
        delays: {
          min: Math.min(...dd),
          max: Math.max(...dd),
          average: average(dd),
          median: median(dd),
        },
      })
    }

    logger.info('For more info go to ./scripts/bridges/matching.csv')

    console.log('Decoder Errors', decoder.errors)

    saveMatchingToFile(matching)
  },
})

function saveMatchingToFile(
  matching: Map<string, { outbound: Asset; inbound: Asset }>,
) {
  writeFileSync(
    './scripts/bridges/matching.csv',
    'protocol;delay;origin;originTx;destination;destinationTx\n' +
      Array.from(matching.entries())
        .map(
          ([_, { outbound, inbound }]) =>
            `${outbound.application};${inbound.blockTimestamp - outbound.blockTimestamp};${outbound.origin};${outbound.txHash};${inbound.destination};${inbound.txHash}`,
        )
        .join('\n'),
  )
}

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
        logger: Logger.SILENT,
        callsPerMinute: chain.rpcCallsPerMinute,
        retryStrategy: 'RELIABLE',
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
      from: 23085465 - (12 * 60 * 60) / 12,
      to: 23085465, // 7th August 00:00
    },
    {
      name: 'arbitrum',
      from: 365731025 - (2 * 60 * 60) / 0.25,
      to: 365731025, // 7th August 00:00
    },
    {
      name: 'base',
      from: 33867726 - (6 * 60 * 60) / 2,
      to: 33867726, // 7th August 00:00
    },
  ],
  protocols: [
    'across',
    'agglayer',
    'cctpv1',
    'cctpv2',
    'debridge',
    'hyperlane',
    'stargate',
    'wormhole-cctp',
    'wormhole-portal',
  ],
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

/*
{
  name: 'ethereum',
  from: 23078306, // 6th August 00:00
  to: 23085465, // 7th August 00:00
},
{
  name: 'arbitrum',
  from: 365386232, // 6th August 00:00
  to: 365731025, // 7th August 00:00
},
{
  name: 'base',
  from: 33824526, // 6th August 00:00
  to: 33867726, // 7th August 00:00
},
*/
