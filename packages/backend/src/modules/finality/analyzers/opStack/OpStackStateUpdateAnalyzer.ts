import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'

import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { utils } from 'ethers'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'

const PROPOSE_FUNCTION_SIGNATURE =
  'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)'

export class OpStackStateUpdateAnalyzer extends BaseAnalyzer {
  private abi: utils.Interface

  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2BlockTime: number,
    private readonly l2Provider: RpcClient,
  ) {
    super(provider, db, projectId)
    this.abi = new utils.Interface([PROPOSE_FUNCTION_SIGNATURE])
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async analyze(
    previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const [previousStateUpdateBlock, currentStateUpdateBlock] =
      await Promise.all([
        await this.getL2Block(previousTransaction.txHash),
        await this.getL2Block(transaction.txHash),
      ])

    const guessedBlockTime =
      (currentStateUpdateBlock.timestamp - previousStateUpdateBlock.timestamp) /
      (currentStateUpdateBlock.number - previousStateUpdateBlock.number)
    assert(
      guessedBlockTime === this.l2BlockTime,
      'Block time computed from state updates is wrong',
    )

    const result: L2Block[] = []
    let timestamp = currentStateUpdateBlock.timestamp
    for (
      let blockNumber = currentStateUpdateBlock.number;
      blockNumber > previousStateUpdateBlock.number;
      blockNumber -= 1
    ) {
      result.push({
        blockNumber,
        timestamp,
      })

      timestamp -= guessedBlockTime
    }

    return result
  }

  async getL2Block(txHash: string) {
    const entireTx = await this.provider.getTransaction(txHash)
    const params = this.abi.decodeFunctionData('proposeL2Output', entireTx.data)
    return await this.l2Provider.getBlock(Number(params._l2BlockNumber), false)
  }
}
