import { getEnv, Logger, type LoggerOptions } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { command, run } from 'cmd-ts'
import groupBy from 'lodash/groupBy'
import { CHAINS } from '../bridges/chains'
import { logToViemLog } from '../bridges/utils/viem'
import { ActionDbImpl } from './ActionDb'
import { createPlugins } from './plugins'
import type { Action } from './plugins/types'

const CONFIG = [
  {
    name: 'ethereum',
    block: 23267551,
  },
  {
    name: 'base',
    block: 34966275,
  },
]

const cmd = command({
  name: 'cli',
  args: {},
  handler: async (_) => {
    const logger = setupLogger()
    const chains = setupChains({ disableRpcLogging: true })

    const plugins = createPlugins(logger, chains)

    const actions: Action[] = []

    for (const config of CONFIG) {
      const rpc = chains.get(config.name)
      assert(rpc)

      const block = await rpc.getBlockWithTransactions(config.block)
      const logs = await rpc.getLogs(config.block, config.block)
      const logsByTx = groupBy(logs, 'transactionHash')

      for (const transaction of block.transactions) {
        assert(transaction.hash)
        for (const log of logsByTx[transaction.hash] ?? []) {
          for (const plugin of plugins) {
            if (plugin.decodeLog === undefined) {
              continue
            }
            const action = await plugin.decodeLog({
              log: logToViemLog(log),
              tx: {
                timestamp: block.timestamp,
                chain: config.name,
                hash: transaction.hash,
                blockNumber: block.number,
                blockHash: block.hash,
              },
              txLogs: (logsByTx[transaction.hash] ?? []).map(logToViemLog),
              txTo: transaction.to
                ? EthereumAddress(transaction.to)
                : undefined,
            })

            if (action) {
              actions.push(action)
            }
          }
        }
      }
    }

    const db = new ActionDbImpl(actions)

    for (const action of actions) {
      for (const plugin of plugins) {
        if (plugin.matchAction === undefined) {
          continue
        }

        const matching = await plugin.matchAction(action, db)

        if (matching) {
          logger.info('Matched', matching)
        }
      }
    }
  },
})
run(cmd, process.argv.slice(2))

function setupLogger() {
  return Logger.INFO.configure({
    logLevel:
      (getEnv().string('LOG_LEVEL') as LoggerOptions['logLevel']) ?? 'INFO',
  })
}

function setupChains(options: { disableRpcLogging: boolean }) {
  const http = new HttpClient()
  const env = getEnv()

  return new Map(
    CHAINS.map((chain) => [
      chain.name,
      new RpcClient({
        url: env.string(`${chain.name.toUpperCase()}_RPC_URL`),
        sourceName: chain.name,
        http,
        logger: options.disableRpcLogging ? Logger.SILENT : Logger.INFO,
        callsPerMinute: chain.rpcCallsPerMinute,
        retryStrategy: 'RELIABLE',
      }),
    ]),
  )
}
