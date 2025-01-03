import { assert, ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { z } from 'zod'

import { Database } from '@l2beat/database'
import { RpcClient } from '@l2beat/shared'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { decodeBatch } from './batch'
import { toTransactionHash } from './hash'

export class PolygonZkEvmT2IAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2Provider: RpcClient,
  ) {
    super(provider, db, projectId)
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const hashes = extractTransactionData(tx.data)
      .map(byteArrFromHexStr)
      // Might be memory intensive - if so, consider batching/sequential processing
      .flatMap(decodeBatch)
      .flatMap((block) => block.transactions)
      .map(toTransactionHash)

    if (hashes.length === 0) {
      return []
    }

    //! Sequential assumption, also we assume an uniform block distribution
    const firstTransaction = hashes.at(0)
    const lastTransaction = hashes.at(-1)

    assert(firstTransaction && lastTransaction, 'Empty batch sequence received')

    const transactionsFromNode = await Promise.all([
      this.l2Provider.getTransaction(firstTransaction),
      this.l2Provider.getTransaction(lastTransaction),
    ])

    const blockNumbers = transactionsFromNode
      .map((tx) => tx.blockNumber)
      .filter((x) => x !== null)

    const maxBlockNumber = Math.max(...blockNumbers)
    const minBlockNumber = Math.min(...blockNumbers)

    return await Promise.all([
      {
        blockNumber: minBlockNumber,
        timestamp: (await this.l2Provider.getBlock(minBlockNumber, false))
          .timestamp,
      },
      {
        blockNumber: maxBlockNumber,
        timestamp: (await this.l2Provider.getBlock(maxBlockNumber, false))
          .timestamp,
      },
    ])
  }
}

const SingleBatch = z.object({
  transactions: z.string(),
  forcedGlobalExitRoot: z.string(),
  forcedBlockHashL1: z.string(),
})
type SingleBatch = z.infer<typeof SingleBatch>

function extractTransactionData(data: string): string[] {
  const decodedInput = decodeData(data)

  const batches = decodedInput.batches as SingleBatch[]

  return batches.map((batch) => batch.transactions)
}

const oldMethod = {
  name: 'sequenceBatches',
  signature: `function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, address l2Coinbase)`,
  id: '0xecef3f99',
}

const newMethod = {
  name: 'sequenceBatches',
  signature: `function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint64 maxSequenceTimestamp, uint64 initSequencedBatch, address l2Coinbase)`,
  id: '0xdef57e54',
}

const oldIface = new utils.Interface([oldMethod.signature])
const newIface = new utils.Interface([newMethod.signature])

/**
 * Transaction batches are compatible across both APIs.
 */
function decodeData(data: string) {
  const txSig = data.slice(0, 10)

  if (txSig === oldMethod.id) {
    return oldIface.decodeFunctionData(oldMethod.name, data)
  }

  if (txSig === newMethod.id) {
    return newIface.decodeFunctionData(newMethod.name, data)
  }
  throw new Error(
    `Programmer error: can't recognize function signature: ${txSig}`,
  )
}
