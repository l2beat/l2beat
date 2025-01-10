import { Logger } from '@l2beat/backend-tools'
import { assert, ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { BlobProvider, EVMTransaction, RpcClient } from '@l2beat/shared'
import { utils } from 'ethers'
import { RlpSerializable } from '../../utils/rlpDecode'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { calculateDelaysFromSegments } from './calculateDelaysFromSegments'
import { getSegmentsFromBlobs, getSegmentsFromCalldata } from './getSegments'

const calldataSignature =
  'addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)'
const iface = new utils.Interface([`function ${calldataSignature}`])

export class ArbitrumT2IAnalyzer extends BaseAnalyzer {
  constructor(
    private readonly blobProvider: BlobProvider,
    private readonly logger: Logger,
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
  ) {
    super(provider, db, projectId)
    this.logger = logger.for(this).tag({
      tag: projectId,
      project: projectId,
    })
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    this.logger.debug('Getting finality', { transaction })
    const tx = await this.provider.getTransaction(transaction.txHash)
    const segments = await this.getSegments(tx)

    // https://linear.app/l2beat/issue/L2B-4752/refactor-finalityindexer-logic-to-allow-analyzers-different
    // TODO: refactor FinalityIndexer to enable calculating finality
    // more accurately
    return calculateDelaysFromSegments(segments)
  }

  async getSegments(tx: EVMTransaction): Promise<RlpSerializable[]> {
    switch (Number(tx.type)) {
      case 2: {
        // We only support addSequencerL2BatchFromOrigin (0x8f111f3c),
        // because this is the only method that is used for now
        assert(
          iface.getSighash(calldataSignature) === tx.data.slice(0, 10),
          `Not supported method: ${tx.data.slice(0, 10)}`,
        )
        const decodedInput = iface.decodeFunctionData(
          calldataSignature,
          tx.data,
        )
        assert(decodedInput[1], 'No data in calldata')
        return getSegmentsFromCalldata(decodedInput[1])
      }
      case 3: {
        assert(
          tx.blobVersionedHashes,
          'Type 3 transaction missing blobVersionedHashes',
        )
        assert(tx.blockNumber, `Tx ${tx}: No pending txs allowed`)

        // get blobs relevant to the transaction
        const { blobs } =
          await this.blobProvider.getBlobsByVersionedHashesAndBlockNumber(
            tx.blobVersionedHashes,
            tx.blockNumber,
          )
        if (blobs.length === 0) return []
        return getSegmentsFromBlobs(blobs)
      }
      default:
        throw new Error(`Unsupported transaction type: ${tx.type}`)
    }
  }
}
