import { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { Database } from '@l2beat/database'
import { RpcClient } from '@l2beat/shared'
import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

const calldataFnName = 'submitData'
const calldataFn =
  'function submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))'

const blobFnName = 'submitBlobs'
const blobFn =
  'function submitBlobs(((bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)[], bytes32, bytes32)'
const iface = new utils.Interface([calldataFn, blobFn])

export class LineaT2IAnalyzer extends BaseAnalyzer {
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
    const decodedInput = this.decodeInput(tx.data)

    const firstBlockInData = Number(decodedInput[0])
    const lastBlockInData = Number(decodedInput[1])

    return await Promise.all([
      {
        blockNumber: firstBlockInData,
        timestamp: (await this.l2Provider.getBlock(firstBlockInData, false))
          .timestamp,
      },
      {
        blockNumber: lastBlockInData,
        timestamp: (await this.l2Provider.getBlock(lastBlockInData, false))
          .timestamp,
      },
    ])
  }

  private decodeInput(data: string): [bigint, bigint] {
    // 0x + first 4 bytes
    const txSig = data.slice(0, 10)

    switch (txSig) {
      case iface.getSighash(calldataFnName): {
        const decoded = iface.decodeFunctionData(calldataFnName, data) as [
          [string, string, string, bigint, bigint],
        ]
        return [decoded[0][3], decoded[0][4]]
      }
      case iface.getSighash(blobFnName): {
        const decoded = iface.decodeFunctionData(blobFnName, data) as [
          [[[string, bigint, bigint]]],
        ]
        return [decoded[0][0][0][1], decoded[0][0][0][2]]
      }
      default:
        throw new Error(
          `Programmer error: can't recognize function signature: ${txSig}`,
        )
    }
  }
}
