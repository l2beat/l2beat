import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import assert from 'assert'
import { utils } from 'ethers'

import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from './types/BaseAnalyzer'

export class LoopringFinalityAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    projectId: ProjectId,
    private readonly l2Provider: LoopringClient,
  ) {
    super(provider, livenessRepository, projectId)
  }

  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async getFinality({
    txHash,
    timestamp: l1Timestamp,
  }: {
    txHash: string
    timestamp: UnixTime
  }) {
    const tx = await this.provider.getTransaction(txHash)
    const { logs } = await tx.wait()

    const log = logs
      .filter((log) =>
        log.topics.includes(
          '0xcc86d9ed29ebae540f9d25a4976d4da36ea4161b854b8ecf18f491cf6b0feb5c',
        ),
      )
      .map((log) => this.decodeLog(log))
      .find((log) => log.name === 'BlockSubmitted')

    assert(log, 'BlockSubmitted log not found')

    const blockIdx = log.args.blockIdx as number

    const block = await this.l2Provider.getBlock(blockIdx)

    return [l1Timestamp.toNumber() - block.createdAt.toNumber()]
  }

  private decodeLog(log: { topics: string[]; data: string }) {
    const i = new utils.Interface([
      'event BlockSubmitted (uint256 indexed blockIdx, bytes32 merkleRoot, bytes32 publicDataHash)',
    ])
    return i.parseLog(log)
  }
}
