import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { Chain } from './chains'
import type { Protocol } from './protocols/protocols'
import type { Message } from './types/Message'
import { logToViemLog } from './utils/viem'

export async function runDecoders(
  chains: (Chain & {
    block: number
    rpc: RpcClient
  })[],
  logger: Logger,
  protocol: Protocol,
) {
  const messages: Message[] = []

  for (const chain of chains) {
    logger.info(`Fetching data for ${chain.name} @ ${chain.block}`)
    const block = await chain.rpc.getBlockWithTransactions(chain.block)
    const logs = await chain.rpc.getLogs(chain.block, chain.block)
    const logsByTx = groupBy(logs, 'transactionHash')

    logger.info(`Running decoder for ${protocol.name}`)
    for (const transaction of block.transactions) {
      assert(transaction.hash)
      const decoded = protocol.decoder(chain, {
        hash: transaction.hash,
        blockNumber: block.number,
        blockTimestamp: block.timestamp,
        logs: (logsByTx[transaction.hash] ?? []).map(logToViemLog),
      })
      if (decoded) {
        messages.push(decoded)
      }
    }
  }
  return messages
}
