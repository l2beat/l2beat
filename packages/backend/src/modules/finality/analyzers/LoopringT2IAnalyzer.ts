import { assert, ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { Database } from '@l2beat/database'
import { DegateClient } from '../../../peripherals/degate'
import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

export class LoopringT2IAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2Provider: LoopringClient | DegateClient,
  ) {
    super(provider, db, projectId)
  }

  getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async analyze(
    _previousTransaction: Transaction,
    { txHash }: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(txHash)
    const { logs } = await tx.wait()

    const log = logs
      .filter(
        (log) =>
          log.topics[0] ===
          '0xcc86d9ed29ebae540f9d25a4976d4da36ea4161b854b8ecf18f491cf6b0feb5c',
      )
      .map((log) => this.decodeLog(log))
      .find((log) => log.name === 'BlockSubmitted')

    assert(log, 'BlockSubmitted log not found')

    const blockIdx = BigNumber.from(log.args.blockIdx).toNumber()
    const block = await this.l2Provider.getBlock(blockIdx)

    return [{ blockNumber: blockIdx, timestamp: block.createdAt.toNumber() }]
  }

  private decodeLog(log: { topics: string[]; data: string }) {
    const i = new utils.Interface([
      'event BlockSubmitted (uint256 indexed blockIdx, bytes32 merkleRoot, bytes32 publicDataHash)',
    ])
    return i.parseLog(log)
  }
}
