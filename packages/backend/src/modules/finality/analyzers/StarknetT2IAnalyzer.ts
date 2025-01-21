import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import type { Database } from '@l2beat/database'
import type { RpcClient, StarknetClient } from '@l2beat/shared'
import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

const ZBigNumber = z.instanceof(BigNumber).transform((n) => n.toBigInt())

const StarknetStateUpdate = z.object({
  programOutput: z.array(ZBigNumber),
})
type StarknetStateUpdate = z.infer<typeof StarknetStateUpdate>

export class StarknetT2IAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2Provider: StarknetClient,
  ) {
    super(provider, db, projectId)
  }
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const decodedTransactionData = decodeTransaction(tx.data)

    const l2BlockNumber = extractBlockNumber(decodedTransactionData)

    const { timestamp: l2Timestamp } =
      await this.l2Provider.getBlockWithTransactions(l2BlockNumber)

    return [{ blockNumber: l2BlockNumber, timestamp: l2Timestamp }]
  }
}

function decodeTransaction(data: string) {
  const signature = `updateStateKzgDA(uint256[] programOutput, bytes[] kzgProofs)`
  const iface = new utils.Interface([`function ${signature}`])

  const decodedInput = iface.decodeFunctionData(signature, data)

  return StarknetStateUpdate.parse({
    programOutput: decodedInput.programOutput,
  })
}

function extractBlockNumber(stateUpdate: StarknetStateUpdate): number {
  const OUTPUT_BLOCK_NUMBER_INDEX = 2 // 3 slot

  const maybeBlockNumber = stateUpdate.programOutput[OUTPUT_BLOCK_NUMBER_INDEX]

  assert(
    maybeBlockNumber !== undefined,
    `Could not extract block number from starknet program output`,
  )

  return Number(maybeBlockNumber)
}
