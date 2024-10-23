import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { utils } from 'ethers'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { BaseAnalyzer } from '../types/BaseAnalyzer'

const PROPOSE_FUNCTION_SIGNATURE =
  'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)'

export class OpStackStateUpdateAnalyzer extends BaseAnalyzer {
  private abi: utils.Interface

  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly l2Provider: RpcClient,
  ) {
    super(provider, db, projectId)
    this.abi = new utils.Interface([PROPOSE_FUNCTION_SIGNATURE])
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'stateUpdates'
  }

  async analyze(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const entireTx = await this.provider.getTransaction(transaction.txHash)
    const params = this.abi.decodeFunctionData('proposeL2Output', entireTx.data)
    const l2BlockNumber = Number(params._l2BlockNumber)
    const l2Block = await this.l2Provider.getBlock(l2BlockNumber)
    const delay = transaction.timestamp.toNumber() - l2Block.timestamp

    return [delay]
  }
}
