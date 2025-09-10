import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { command, positional, run, string } from 'cmd-ts'
import { logToViemLog } from '../../../../scripts/bridges/utils/viem'
import { createBridgePlugins } from '../plugins'
import type { BridgeEvent } from '../plugins/types'
import * as examples from './examples.json'
import { InMemoryEventDb } from './InMemoryEventDb'

const cmd = command({
  name: 'bridges:example',
  args: {
    name: positional({ type: string, displayName: 'name' }),
  },
  handler: async (args) => {
    const logger = Logger.INFO

    const example = examples[args.name as keyof typeof examples]
    if (!example) {
      logger.error(`${args.name}: example not found, see examples.json`)
      return
    }

    const http = new HttpClient()
    const env = getEnv()

    const chains = example.map(({ chain, tx }) => {
      return {
        txHash: tx,
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

    const plugins = createBridgePlugins(logger)

    const events: BridgeEvent[] = []
    for (const chain of chains) {
      const tx = await chain.rpc.getTransaction(chain.txHash)
      assert(tx.blockNumber)
      const block = await chain.rpc.getBlockWithTransactions(tx.blockNumber)
      const logs = await chain.rpc.getLogs(block.number, block.number)
      const txLogs = logs
        .filter((l) => l.transactionHash === tx.hash)
        .map(logToViemLog)

      for (const log of txLogs) {
        for (const plugin of plugins) {
          if (!plugin.capture) {
            continue
          }
          const event = await plugin.capture({
            log: log,
            txLogs: txLogs,
            ctx: {
              timestamp: block.timestamp,
              chain: chain.name,
              blockNumber: block.number,
              blockHash: block.hash,
              txHash: tx.hash,
              txTo: tx.to ? EthereumAddress(tx.to) : undefined,
              logIndex: log.logIndex ?? -1,
            },
          })

          if (event) {
            logger.info('Captured', event)
            events.push(event)
          }
        }
      }
    }

    const eventDb = new InMemoryEventDb(events)

    for (const plugin of plugins) {
      if (!plugin.match) {
        continue
      }
      for (const event of events) {
        const matched = plugin.match(event, eventDb)
        if (matched) {
          logger.info('Matched', matched)
        }
      }
    }
  },
})

run(cmd, process.argv.slice(2))
