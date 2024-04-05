import { assert, TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { BaseAnalyzer } from './types/BaseAnalyzer'

type Decoded = [[string, string, string, number, number]]

const calldataFnName = 'submitData'
const calldataFn =
  'function submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))'

const blobFnName = 'submitBlobData'
const blobFn = `function submitBlobData(
  tuple(
    bytes32 parentStateRootHash, 
    bytes32 dataParentHash, 
    bytes32 finalStateRootHash, 
    uint256 firstBlockInData, 
    uint256 finalBlockInData, 
    bytes32 snarkHash
  ) _submissionData, 
  uint256 _dataEvaluationClaim, 
  bytes _kzgCommitment, 
  bytes _kzgProof)`

const iface = new utils.Interface([calldataFn, blobFn])

export class LineaFinalityAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedInput = this.decodeInput(tx.data)

    const firstBlockInData = Number(decodedInput[0][3])
    const lastBlockInData = Number(decodedInput[0][4])

    assert(this.l2Provider, 'Linea RPC provider not defined')
    const timestamps = await Promise.all([
      (await this.l2Provider.getBlock(firstBlockInData)).timestamp,
      (await this.l2Provider.getBlock(lastBlockInData)).timestamp,
    ])

    return timestamps.map((l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp)
  }

  private decodeInput(data: string): Decoded {
    // 0x + first 4 bytes
    const txSig = data.slice(0, 10)

    switch (txSig) {
      case iface.getSighash(calldataFnName):
        return iface.decodeFunctionData(calldataFnName, data) as Decoded
      case iface.getSighash(blobFnName):
        return iface.decodeFunctionData(blobFnName, data) as Decoded

      default:
        throw new Error(
          `Programmer error: can't recognize function signature: ${txSig}`,
        )
    }
  }
}
