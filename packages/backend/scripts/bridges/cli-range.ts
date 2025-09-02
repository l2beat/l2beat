import { getEnv, Logger, type LoggerOptions } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { command, number, positional, run, string } from 'cmd-ts'
import { CHAINS, type Chain } from './chains'
import { Decoder } from './Decoder'
import { PROTOCOLS } from './protocols/protocols'

const args = {
  protocol: positional({
    type: string,
    displayName: 'protocol',
  }),
  chain: positional({
    type: string,
    displayName: 'chain',
  }),
  from: positional({
    type: number,
    displayName: 'from',
  }),
  to: positional({
    type: number,
    displayName: 'to',
  }),
}

const cmd = command({
  name: 'bridges:cli-range',
  args,
  handler: async (args) => {
    const logger = setupLogger()
    const chain = setupChain(
      { name: args.chain, from: args.from, to: args.to },
      { disableRpcLogging: true },
    )

    const decoder = new Decoder(PROTOCOLS, [chain], logger)

    const BATCH_SIZE = 100
    const promises = []
    promises.push(
      (async () => {
        for (let start = chain.from; start < chain.to; start += BATCH_SIZE) {
          logBatchProcessing(logger, chain, start, BATCH_SIZE)
          try {
            const { assets, messages } = await decoder.executeMany(
              [args.protocol],
              {
                name: chain.name,
                from: start,
                to: Math.min(start + BATCH_SIZE, chain.to),
              },
            )

            for (const m of messages) {
              logger.info(`${m.protocol} ${m.direction} message: ${m.txHash}`)
            }
            for (const a of assets) {
              logger.info(a)
            }
          } catch (_) {
            throw new Error(
              `[${chain.name}] Failed batch <${start},${Math.min(start + BATCH_SIZE, chain.to)}>`,
            )
          }
        }
      })(),
    )

    await Promise.allSettled(promises).then((results) => {
      const failedPromises = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason)

      if (failedPromises.length > 0)
        console.log('Failed batches:', failedPromises)
    })
  },
})
run(cmd, process.argv.slice(2))

function setupLogger() {
  return Logger.INFO.configure({
    logLevel:
      (getEnv().string('LOG_LEVEL') as LoggerOptions['logLevel']) ?? 'INFO',
  })
}

function setupChain(
  chainConfig: { name: string; from: number; to: number },
  options: { disableRpcLogging: boolean },
) {
  const http = new HttpClient()
  const env = getEnv()

  const chain = CHAINS.find((c) => c.name === chainConfig.name)
  assert(chain, `${chainConfig.name}: Chain not found`)

  const rpc = new RpcClient({
    url: env.string(`${chain.name.toUpperCase()}_RPC_URL`),
    sourceName: chain.name,
    http,
    logger: options.disableRpcLogging ? Logger.SILENT : Logger.INFO,
    callsPerMinute: chain.rpcCallsPerMinute,
    retryStrategy: 'RELIABLE',
  })

  return {
    ...chain,
    from: chainConfig.from,
    to: chainConfig.to,
    rpc,
  }
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
