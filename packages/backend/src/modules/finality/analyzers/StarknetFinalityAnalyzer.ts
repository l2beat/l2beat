import { assert } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from './types/BaseAnalyzer'

const ZBigNumber = z.instanceof(BigNumber).transform(Number)

const StarknetStateUpdate = z.object({
  programOutput: z.array(ZBigNumber),
  kzgProof: z.string(),
})
type StarknetStateUpdate = z.infer<typeof StarknetStateUpdate>

export class StarknetFinalityAnalyzer extends BaseAnalyzer<StarknetClient> {
  constructor(
    protected override readonly provider: RpcClient,
    protected override readonly livenessRepository: LivenessRepository,
    protected override readonly projectId: ProjectId,
    protected override readonly l2Provider: StarknetClient,
  ) {
    super(provider, livenessRepository, projectId, l2Provider)
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

    const decodedTransactionData = decodeTransaction(tx.data)

    const l2BlockNumber = extractBlockNumber(decodedTransactionData)

    const { timestamp: l2Timestamp } = await this.l2Provider.getBlock(
      l2BlockNumber,
    )

    return [l1Timestamp.toNumber() - l2Timestamp]
  }
}

function decodeTransaction(data: string) {
  const signature = `updateStateKzgDA(uint256[] programOutput, bytes kzgProof)`
  const iface = new utils.Interface([`function ${signature}`])

  const decodedInput = iface.decodeFunctionData(signature, data)

  return StarknetStateUpdate.parse({
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    programOutput: decodedInput.programOutput,
    kzgProof: decodedInput.kzgProof,
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  })
}

function extractBlockNumber(stateUpdate: StarknetStateUpdate): number {
  const OUTPUT_BLOCK_NUMBER_INDEX = 2 // 3 slot

  const maybeBlockNumber = stateUpdate.programOutput[OUTPUT_BLOCK_NUMBER_INDEX]

  assert(
    maybeBlockNumber !== undefined,
    `Could not extract block number from starknet program output`,
  )

  return maybeBlockNumber
}
