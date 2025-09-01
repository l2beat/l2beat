// TODO: add envio
import { getEnv, Logger, type LoggerOptions } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { command, run } from 'cmd-ts'
import groupBy from 'lodash/groupBy'
import { CHAINS } from '../bridges/chains'
import { logToViemLog } from '../bridges/utils/viem'
import { Portal_TransferRedeemed } from './decoders/app/portal/TransferRedeemed'
import { Wormhole_LogMessagePublished } from './decoders/message/wormhole/LogMessagePublished'
import { matcher } from './matchers/portal/matcher'
import { DataService } from './types/DataService'
import { TokenService } from './types/TokenService'

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

// change to map
const DECODERS = [Wormhole_LogMessagePublished, Portal_TransferRedeemed]

const MATCHERS = [matcher]

const cmd = command({
  name: 'cli',
  args: {},
  handler: async (_) => {
    const logger = setupLogger()
    const chains = setupChains({ disableRpcLogging: true })
    const dataService = new DataService()
    const tokenService = new TokenService()

    for (const config of CONFIG) {
      const rpc = chains.get(config.name)
      assert(rpc)

      const block = await rpc.getBlockWithTransactions(config.block)
      const logs = await rpc.getLogs(config.block, config.block)
      const logsByTx = groupBy(logs, 'transactionHash')

      for (const transaction of block.transactions) {
        assert(transaction.hash)
        for (const log of logsByTx[transaction.hash] ?? []) {
          for (const decoder of DECODERS) {
            if (log.topics[0] === decoder.topic) {
              const { message, transfer } = await decoder.decoder({
                log: logToViemLog(log),
                transactionHash: transaction.hash,
                blockNumber: block.number,
                blockTimestamp: block.timestamp,
                transactionLogs: (logsByTx[transaction.hash] ?? []).map(
                  logToViemLog,
                ),
                transactionTo: transaction.to
                  ? EthereumAddress(transaction.to)
                  : undefined,
                chain: config.name,
              })
              logger.info('Decoded', { message, transfer })

              if (message) dataService.saveUnmatchedMessage(message)
              if (transfer) dataService.saveUnmatchedTransfer(transfer)
            }
          }
        }
      }
    }

    for (const m of MATCHERS) {
      const output = await m(dataService, tokenService, chains)

      logger.info('Matched', output)
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
