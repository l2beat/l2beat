import { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { Database } from '@l2beat/database'
import { BlobProvider, RpcClient } from '@l2beat/shared'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { decodeBlob } from './decodeBlob'

export const blobFnName = 'submitBlobs'
const blobFn =
  'function submitBlobs(tuple(uint256 dataEvaluationClaim, bytes kzgCommitment, bytes kzgProof, bytes32 finalStateRootHash, bytes32 snarkHash)[] _blobSubmissions, bytes32 _parentShnarf, bytes32 _finalBlobShnarf)'
export const lineaIface = new utils.Interface([blobFn])

export class LineaT2IAnalyzer extends BaseAnalyzer {
  constructor(
    private readonly blobProvider: BlobProvider,
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
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

    switch (tx.data.slice(0, 10)) {
      // for now we only support blobs as the function that is using calldata was never called so we can't test it
      case lineaIface.getSighash(blobFnName): {
        const blobs = await this.blobProvider.getRelevantBlobs(
          transaction.txHash,
        )
        const blocksData = blobs.blobs.flatMap((blob) => decodeBlob(blob.data))
        return blocksData
      }
      default:
        throw new Error(
          `Unexpected transaction data for function: ${tx.data.slice(0, 10)}`,
        )
    }
  }
}
