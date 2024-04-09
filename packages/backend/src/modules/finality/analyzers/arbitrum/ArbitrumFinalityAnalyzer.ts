import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { ethers } from 'ethers'

import { BlobClient } from '../../../../peripherals/blobclient/BlobClient'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { byteArrFromHexStr } from '../opStack/utils'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { getRollupData } from './blobsToData'
import { calculateDelaysFromSegments } from './calculateDelaysFromSegments'
import { getSegments } from './getSegments'

const sequencerInboxInt = new ethers.utils.Interface([
  'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder)',
  'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount)',
])

export class ArbitrumFinalityAnalyzer extends BaseAnalyzer {
  constructor(
    private readonly blobClient: BlobClient,
    private readonly logger: Logger,
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    projectId: ProjectId,
  ) {
    super(provider, livenessRepository, projectId)
    this.logger = logger.for(this).tag(projectId.toString())
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    this.logger.debug('Getting finality', { transaction })
    const submissionTimestamp = transaction.timestamp

    const rollupData = await this.getRollupData(transaction)
    const segments = getSegments(rollupData)
    const delays = calculateDelaysFromSegments(
      segments,
      submissionTimestamp.toNumber(),
    )
    // https://linear.app/l2beat/issue/L2B-4752/refactor-finalityindexer-logic-to-allow-analyzers-different
    // TODO: refactor FinalityIndexer to enable calculating finality
    // more accurately
    return [delays.minDelay, delays.avgDelay, delays.maxDelay]
  }

  async getRollupData(transaction: { txHash: string }): Promise<Uint8Array> {
    const tx = await this.blobClient.getTxWithRelevantBlobs(transaction.txHash)

    if (tx.type !== BlobClient.BLOB_TX_TYPE) {
      const selector = tx.input.slice(0, 10)

      // not a blob transaction, get data from calldata
      const calldata = sequencerInboxInt.decodeFunctionData(selector, tx.input)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = calldata.data

      console.log('data', data)

      assert(data, 'No data found in calldata')
      assert(typeof data === 'string', 'Data is not a string')

      return byteArrFromHexStr(data)
    }

    assert(tx.relevantBlobs.length > 0, 'Blob transaction without blobs')
    return getRollupData(tx.relevantBlobs)
  }
}
