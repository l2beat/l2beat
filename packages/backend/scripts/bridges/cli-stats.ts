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

const CONFIG: {
  chains: { name: string; from: number; to: number }[]
  protocols: string[]
} = {
  // names have to be the same as in ./chains.ts
  chains: [
    {
      name: 'ethereum',
      from: 23085465 - (2 * 60 * 60) / 12, // ~2 hours, block time is 12s
      to: 23085465, // 7th August 00:00
    },
    {
      name: 'arbitrum',
      from: 365731025 - (2 * 60 * 60) / 0.25, // ~2 hours, block time is 250ms
      to: 365731025, // 7th August 00:00
    },
    {
      name: 'base',
      from: 33867726 - (2 * 60 * 60) / 2, // ~2 hours, block time is 2s
      to: 33867726, // 7th August 00:00
    },
  ],
  // names have to be the same as in decoders exports
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

const cmd = command({
  name: 'bridges:cli-stats',
  args: {},
  handler: async (_) => {
    const logger = setupLogger()
    const chains = setupChains(CONFIG.chains, { disableRpcLogging: true })
    const confirmation = await printScriptSummaryAndConfirmation(
      chains,
      CONFIG.protocols,
      logger,
    )
    if (confirmation.toLowerCase() !== 'yes') {
      logger.error('Execution aborted')
      return
    }

    const decoder = new Decoder(PROTOCOLS, chains, logger)

    const outbound: Map<string, Asset> = new Map()
    const inbound: Map<string, Asset> = new Map()
    const matching: Map<string, { outbound: Asset; inbound: Asset }> = new Map()

    const BATCH_SIZE = 100
    const promises = []
    for (const chain of chains) {
      promises.push(
        (async () => {
          for (let start = chain.from; start <= chain.to; start += BATCH_SIZE) {
            logBatchProcessing(logger, chain, start, BATCH_SIZE)
            try {
              const { assets } = await decoder.executeMany(CONFIG.protocols, {
                name: chain.name,
                from: start,
                to: Math.min(start + BATCH_SIZE, chain.to),
              })

              for (const asset of assets) {
                logAsset(logger, asset)
                const matchingId = `${asset.application}_${asset.matchingId}`
                if (asset.direction === 'outbound') {
                  outbound.set(matchingId, asset)
                  saveOutboundToFile(outbound)

                  const matchingInbound = inbound.get(matchingId)
                  if (matchingInbound) {
                    logMatching(logger, asset, matchingInbound)
                    matching.set(matchingId, {
                      outbound: asset,
                      inbound: matchingInbound,
                    })
                    saveMatchingToFile(matching)
                  }
                }

                if (asset.direction === 'inbound') {
                  inbound.set(matchingId, asset)
                  saveInboundToFile(inbound)

                  const matchingOutbound = outbound.get(matchingId)
                  if (matchingOutbound) {
                    logMatching(logger, matchingOutbound, asset)
                    matching.set(matchingId, {
                      outbound: matchingOutbound,
                      inbound: asset,
                    })
                    saveMatchingToFile(matching)
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

    printStats(matching, logger, inbound, outbound)

    saveMatchingToFile(matching)
    saveInboundToFile(inbound)
    saveOutboundToFile(outbound)

    logger.info(
      'For more info go to ./scripts/bridges/matching.csv and ./scripts/bridges/inbound.csv and ./scripts/bridges/outbound.csv',
    )

    console.log('Decoder Errors', decoder.errors)
  },
})
run(cmd, process.argv.slice(2))

function setupLogger() {
  return Logger.INFO.configure({
    logLevel:
      (getEnv().string('LOG_LEVEL') as LoggerOptions['logLevel']) ?? 'INFO',
  })
}

function setupChains(
  chainsConfig: { name: string; from: number; to: number }[],
  options: { disableRpcLogging: boolean },
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
        logger: options.disableRpcLogging ? Logger.SILENT : Logger.INFO,
        callsPerMinute: chain.rpcCallsPerMinute,
        retryStrategy: 'RELIABLE',
      }),
    }
  })
  return chains
}

function printScriptSummaryAndConfirmation(
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
    'Output will be saved continuously to ./scripts/bridges/matching.csv and ./scripts/bridges/inbound.csv and ./scripts/bridges/outbound.csv (Files will be cleared in the beginning)',
  )

  return new Promise((resolve) =>
    rl.question('Do you want to run the script? [yes] ', (answer) => {
      rl.close()
      resolve(answer)
    }),
  )
}

function logBatchProcessing(
  logger: Logger,
  chain: Chain & { from: number; to: number },
  start: number,
  batchSize: number,
) {
  logger.info(`[${chain.name}] Processing batch`, {
    from: start,
    to: Math.min(start + batchSize, chain.to),
    status:
      (((start - chain.from) * 100) / (chain.to - chain.from)).toFixed(2) + '%',
  })
}

function logMatching(logger: Logger, outbound: Asset, inbound: Asset) {
  logger.debug(`${outbound.application} matched`, {
    from: outbound.origin,
    to: outbound.destination,
    amount: outbound.amount,
    delay: inbound.blockTimestamp - outbound.blockTimestamp,
  })
}

function logAsset(logger: Logger, asset: Asset) {
  logger.debug('Decoded', {
    protocol: asset.application,
    direction: asset.direction,
    network: asset.direction === 'outbound' ? asset.origin : asset.destination,
  })
}

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

function saveOutboundToFile(outbound: Map<string, Asset>) {
  writeFileSync(
    './scripts/bridges/outbound.csv',
    'protocol;chain;direction;amount;token;tx\n' +
      Array.from(outbound.entries())
        .map(
          ([_, transfer]) =>
            `${transfer.application};${transfer.origin};${transfer.direction};${transfer.amount};${transfer.token};${transfer.txHash}`,
        )
        .join('\n'),
  )
}

function saveInboundToFile(inbound: Map<string, Asset>) {
  writeFileSync(
    './scripts/bridges/inbound.csv',
    'protocol;chain;direction;amount;token;tx\n' +
      Array.from(inbound.entries())
        .map(
          ([_, transfer]) =>
            `${transfer.application};${transfer.origin};${transfer.direction};${transfer.amount};${transfer.token};${transfer.txHash}`,
        )
        .join('\n'),
  )
}

function printStats(
  matching: Map<string, { outbound: Asset; inbound: Asset }>,
  logger: Logger,
  inbound: Map<string, Asset>,
  outbound: Map<string, Asset>,
) {
  for (const protocol of CONFIG.protocols) {
    const delays = Array.from(matching.values())
      .filter((x) => x.inbound.application === protocol)
      .map((m) => m.inbound.blockTimestamp - m.outbound.blockTimestamp)

    logger.info(`${protocol} stats`, {
      transfers: {
        outbound: Array.from(outbound.values()).filter(
          (x) => x.application === protocol,
        ).length,
        inbound: Array.from(inbound.values()).filter(
          (x) => x.application === protocol,
        ).length,
      },
      delays:
        delays.length > 0
          ? {
              min: Math.min(...delays),
              max: Math.max(...delays),
              average: average(delays),
              median: median(delays),
            }
          : 'empty',
    })
  }
}

function average(arr: number[]) {
  return arr.reduce((a, b) => a + b) / arr.length
}

function median(numbers: number[]) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
