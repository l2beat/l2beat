import {
  notUndefined,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { byteArrFromHexStr } from '../opStack/utils'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { decodeBatch } from './batch'
import { toTransactionHash } from './hash'

export class PolygonZkEvmFinalityAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    projectId: ProjectId,
    private readonly l2Provider: RpcClient,
  ) {
    super(provider, livenessRepository, projectId)
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const hashes = extractTransactionData(tx.data)
      .map(byteArrFromHexStr)
      .flatMap(decodeBatch)
      .flatMap((block) => block.transactions)
      .map(toTransactionHash)

    //TODO: poor stuff given the batch can contain ~250 txs, either make sure its rate limited or pick at random a few txs
    const blocks = await Promise.all(
      hashes.map((hash) => this.l2Provider.getTransaction(hash)),
    )

    const timestamps = blocks
      .map((block) => block.timestamp)
      .filter(notUndefined)
      .map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)

    return timestamps
  }
}

const signature = `sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint64 maxSequenceTimestamp, uint64 initSequencedBatch, address l2Coinbase)`
const iface = new utils.Interface([`function ${signature}`])

const ZBigNumber = z.instanceof(BigNumber).transform((n) => n.toBigInt())

const SingleBatch = z.object({
  transactions: z.string(),
  forcedGlobalExitRoot: z.string(),
  forcedBlockHashL1: z.string(),
})
type SingleBatch = z.infer<typeof SingleBatch>

const NewAPI = z.object({
  batches: z.array(SingleBatch),
  maxSequenceTimestamp: ZBigNumber,
  initSequencedBatch: ZBigNumber,
  l2Coinbase: z.string(),
})
type NewAPI = z.infer<typeof NewAPI>

function extractTransactionData(data: string): string[] {
  const decodedInput = iface.decodeFunctionData(signature, data)

  const batches = decodedInput.batches as SingleBatch[]

  return batches.map((batch) => batch.transactions)
}
