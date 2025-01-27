import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { type BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

type RawCommittedBlock = {
  timestamp: BigNumber
  blockNumber: BigNumber
}

const CommittedBlock = z.object({
  blockNumber: z.number(),
  timestamp: z.number(),
})

export class ZkSyncLiteT2IAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l2Blocks = decodeTransaction(tx.data)

    return l2Blocks.map((l2Block) => ({
      blockNumber: l2Block.blockNumber,
      timestamp: l2Block.timestamp,
    }))
  }
}

function decodeTransaction(data: string) {
  const committedBlockStruct =
    '(uint32 blockNumber, uint64 priorityOperations, bytes32 pendingOnChainOperationsHash, uint256 timestamp, bytes32 stateHash, bytes32 commitment)'

  const proofInputStruct =
    '(uint256[], uint256[], uint256[], uint8[], uint256[16])'

  const signature = `proveBlocks(${committedBlockStruct}[] calldata _committedBlocks, ${proofInputStruct} memory _proofInput)`
  const iface = new utils.Interface([`function ${signature}`])

  const decodedInput = iface.decodeFunctionData(signature, data)

  const rawCommittedBlocks: RawCommittedBlock[] = decodedInput._committedBlocks

  return rawCommittedBlocks.map((rawCommittedBlock) =>
    CommittedBlock.parse({
      blockNumber: Number(rawCommittedBlock.blockNumber),
      timestamp: Number(rawCommittedBlock.timestamp),
    }),
  )
}
