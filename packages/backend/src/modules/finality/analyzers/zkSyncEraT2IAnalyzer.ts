import type { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { z } from 'zod'
import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

type zkSyncEraDecoded = [number, number, number, string]

const BatchRangeResponse = z.object({
  result: z.array(z.string()).length(2),
})

export class zkSyncEraT2IAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2Provider: RpcClient,
  ) {
    super(provider, db, projectId)
  }

  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const decodedInput = this.decodeInput(tx.data)
    const blocks: L2Block[] = []

    const batchFrom = Number(decodedInput[1])
    const batchTo = Number(decodedInput[2])

    // for now batchFrom and batchTo are always the same, but with the next upgrade they can post few batches at once
    for (let batchNum = batchFrom; batchNum <= batchTo; batchNum++) {
      const blockRange = await this.l2Provider.query(
        'zks_getL1BatchBlockRange',
        [batchNum],
      )
      const response = BatchRangeResponse.parse(blockRange)
      const [from, to] = response.result

      const l2Blocks = await Promise.all([
        this.l2Provider.getBlock(Number(from), false),
        this.l2Provider.getBlock(Number(to), false),
      ])

      l2Blocks.forEach((block) => {
        blocks.push({
          timestamp: block.timestamp,
          blockNumber: block.number,
        })
      })
    }

    return blocks
  }

  private decodeInput(data: string) {
    const fnSignature =
      'proveBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)'
    const i = new utils.Interface([`function ${fnSignature}`])
    const decodedInput = i.decodeFunctionData(
      fnSignature,
      data,
    ) as zkSyncEraDecoded
    return decodedInput
  }
}
