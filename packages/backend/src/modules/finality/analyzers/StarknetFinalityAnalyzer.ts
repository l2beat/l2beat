import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { Database } from '@l2beat/database'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { BaseAnalyzer } from './types/BaseAnalyzer'

const ZBigNumber = z.instanceof(BigNumber).transform((n) => n.toBigInt())

const StarknetStateUpdate = z.object({
  programOutput: z.array(ZBigNumber),
})
type StarknetStateUpdate = z.infer<typeof StarknetStateUpdate>

export class StarknetFinalityAnalyzer extends BaseAnalyzer {
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

  async analyze(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedTransactionData = decodeTransaction(tx.data)

    const l2BlockNumber = extractBlockNumber(decodedTransactionData)

    const { timestamp: l2Timestamp } =
      await this.l2Provider.getBlock(l2BlockNumber)

    return [l1Timestamp.toNumber() - l2Timestamp]
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
