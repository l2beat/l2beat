import type { Logger } from '@l2beat/backend-tools'
import { type Block, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { logToViemLog } from '../../../scripts/bridges/utils/viem'
import type { BlockProcessor } from '../types'
import type { BridgeMatcher } from './BridgeMatcher'
import type { BridgePlugin, LogToDecode, TxDetails } from './plugins/types'

export class BridgeBlockProcessor implements BlockProcessor {
  constructor(
    public chain: string,
    private plugins: BridgePlugin[],
    private bridgeMatcher: BridgeMatcher,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async processBlock(block: Block, logs: Log[]): Promise<void> {
    const toDecode = getLogsToDecode(this.chain, block, logs)
    let count = 0
    for (const logToDecode of toDecode) {
      for (const plugin of this.plugins) {
        try {
          const event = await plugin.decode?.(logToDecode)
          if (event) {
            count++
            this.bridgeMatcher.addEvent(event)
          }
        } catch (e) {
          this.logger.error(e)
        }
      }
    }
    this.logger.info('Block processed', {
      chain: this.chain,
      blockNumber: block.number,
      events: count,
    })
  }
}

function getLogsToDecode(chain: string, block: Block, logs: Log[]) {
  const toDecode: LogToDecode[] = []
  const viemLogs = logs.map(logToViemLog)

  const txToMap: Record<string, EthereumAddress> = {}
  const txs = block.transactions
    .filter((x) => !!x.hash) // TODO: why can this be missing!?
    .map(
      (tx): TxDetails => ({
        timestamp: block.timestamp,
        chain,
        blockHash: block.hash,
        blockNumber: block.number,
        // biome-ignore lint/style/noNonNullAssertion: We just checked
        hash: tx.hash!,
      }),
    )
  for (const tx of block.transactions) {
    if (tx.hash && tx.to) {
      txToMap[tx.hash] = EthereumAddress(tx.to)
    }
  }

  for (const log of viemLogs) {
    const tx = txs.find((x) => x.hash === log.transactionHash)
    if (!tx) {
      continue
    }
    toDecode.push({
      log,
      tx,
      txLogs: viemLogs.filter((x) => x.transactionHash === log.transactionHash),
      txTo: txToMap[tx.hash],
    })
  }

  return toDecode
}
