import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { command, positional, run, string } from 'cmd-ts'
import { logToViemLog } from '../../../../scripts/bridges/utils/viem'
import { createBridgePlugins } from '../plugins'
import type { BridgeEvent } from '../plugins/types'
import { MemoryEventDb } from './EventDb'
import * as examples from './examples.json'

const args = {
  name: positional({
    type: string,
    displayName: 'name',
  }),
}

const cmd = command({
  name: 'bridges:example',
  args,
  handler: async (args) => {
    const logger = Logger.INFO

    const example = examples[args.name as keyof typeof examples]
    if (!example) {
      logger.error(`${args.name}: example not found, see examples.json`)
      return
    }

    const chains = initChains([example.outboud, example.inbound], logger)
    const plugins = createBridgePlugins()

    const events: BridgeEvent[] = []
    for (const chain of chains) {
      const block = await chain.rpc.getBlockWithTransactions(chain.block)
      const transaction = block.transactions.find(
        (t) => t.hash?.toLowerCase() === chain.tx,
      )
      assert(
        transaction && transaction.hash,
        `Transaction not found: ${chain.tx} @ ${chain.name}`,
      )
      const logs = await chain.rpc.getLogs(chain.block, chain.block)
      const txLogs = logs.filter((l) => l.transactionHash === chain.tx)

      for (const log of txLogs) {
        for (const plugin of plugins) {
          if (!plugin.capture) {
            continue
          }
          const event = await plugin.capture({
            log: logToViemLog(log),
            txLogs: txLogs.map(logToViemLog),
            ctx: {
              timestamp: block.timestamp,
              chain: chain.name,
              blockNumber: block.number,
              blockHash: block.hash,
              txHash: transaction.hash,
              txTo: transaction.to
                ? EthereumAddress(transaction.to)
                : undefined,
              logIndex: log.logIndex,
            },
          })

          if (event) {
            logger.info('Captured', event)
            events.push(event)
          }
        }
      }
    }

    const eventDb = new MemoryEventDb(events)

    for (const event of events) {
      for (const plugin of plugins) {
        if (!plugin.match) {
          continue
        }

        const matched = plugin.match(event, eventDb)

        if (matched) {
          logger.info('Matched', matched)
        }
      }
    }
  },
})

function initChains(
  chains: {
    chain: string
    block: number
    tx: string
  }[],
  logger: Logger,
) {
  const http = new HttpClient()
  const env = getEnv()

  return chains.map(({ chain, block, tx }) => {
    return {
      block,
      tx,
      name: chain,
      rpc: new RpcClient({
        url: env.string(`${chain.toUpperCase()}_RPC_URL`),
        sourceName: chain,
        http,
        logger,
        callsPerMinute: 600,
        retryStrategy: 'SCRIPT',
      }),
    }
  })
}

run(cmd, process.argv.slice(2))
