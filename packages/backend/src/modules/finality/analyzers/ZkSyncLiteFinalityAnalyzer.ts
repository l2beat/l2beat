import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { z } from 'zod'

import { BaseAnalyzer, Delay } from './types/BaseAnalyzer'

type RawCommittedBlock = {
  timestamp: BigNumber
  blockNumber: BigNumber
}

const CommittedBlock = z.object({
  blockNumber: z.number(),
  timestamp: z.number(),
})

export class ZkSyncLiteFinalityAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'proofSubmissions'
  }

  async analyze(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<Delay[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const l2Blocks = decodeTransaction(tx.data)

    // TODO(radomski): Fill out the l2BlockNumber
    return l2Blocks.map(
      (l2Block) =>
        ({
          l2BlockNumber: 0,
          duration: l1Timestamp.toNumber() - l2Block.timestamp,
        }) satisfies Delay,
    )
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
