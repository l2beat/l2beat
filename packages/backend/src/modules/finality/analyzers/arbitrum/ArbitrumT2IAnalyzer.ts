import type { Logger } from '@l2beat/backend-tools'
import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'

import zlib from 'zlib'
import type { Database } from '@l2beat/database'
import type {
  Blob,
  BlobProvider,
  EVMTransaction,
  RpcClient,
} from '@l2beat/shared'
import { utils } from 'ethers'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import { type RlpSerializable, rlpDecode } from '../../utils/rlpDecode'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { blobsToData } from './blobsToData'
import { calculateDelaysFromSegments } from './calculateDelaysFromSegments'
import { numberToByteArr } from './utils'

const methods = new Map<string, { name: string; signature: string }>([
  [
    '0x8f111f3c',
    {
      name: 'addSequencerL2BatchFromOrigin',
      signature:
        'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
    },
  ],
  [
    '0x6f12b0c9',
    {
      name: 'addSequencerL2BatchFromOrigin',
      signature:
        'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
    },
  ],
  [
    '0x69cacded',
    {
      name: 'addSequencerL2BatchFromOriginDelayProof',
      signature:
        'function addSequencerL2BatchFromOriginDelayProof(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
    },
  ],
])

const BROTLI_COMPRESSION_TYPE = 0x00

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
        const selector = tx.data.slice(0, 10)
        const method = methods.get(selector)

        assert(method, `Not supported method: ${selector}`)

        const iface = new utils.Interface([`${method.signature}`])

        const decodedInput = iface.decodeFunctionData(method.name, tx.data)
        assert(decodedInput[1], 'No data in calldata')
        return this.getSegmentsFromCalldata(decodedInput[1])
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
        return this.getSegmentsFromBlobs(blobs)
      }
      default:
        throw new Error(`Unsupported transaction type: ${tx.type}`)
    }
  }

  getSegmentsFromBlobs(relevantBlobs: Blob[]): RlpSerializable[] {
    const blobs = relevantBlobs.map(({ data }) => byteArrFromHexStr(data))
    const payload = blobsToData(blobs)
    const decompressed = this.decompressPayload(payload)
    // I do not understand why this is necessary, but it is
    // My guess is that the shape of the data is always the same,
    // so it's an optimization technique to save couple of bytes
    const rlpEncoded = this.concatWithLengthForRlp(decompressed)
    const segments = rlpDecode(rlpEncoded)
    assert(Array.isArray(segments), 'Expected segments to be an array')

    return segments
  }

  getSegmentsFromCalldata(data: string): RlpSerializable[] {
    const payload = byteArrFromHexStr(data)
    const decompressed = this.decompressPayload(payload)
    // I do not understand why this is necessary, but it is
    // My guess is that the shape of the data is always the same,
    // so it's an optimization technique to save couple of bytes
    const rlpEncoded = this.concatWithLengthForRlp(decompressed)
    const segments = rlpDecode(rlpEncoded)
    assert(Array.isArray(segments), 'Expected segments to be an array')

    return segments
  }

  decompressPayload(payload: Uint8Array): Uint8Array {
    const compressionType = payload[0]
    assert(
      compressionType === BROTLI_COMPRESSION_TYPE,
      `Expected compression type to be ${BROTLI_COMPRESSION_TYPE}, got ${compressionType}`,
    )
    const data = payload.slice(1)
    const decompressedData = zlib.brotliDecompressSync(data)
    return Uint8Array.from(decompressedData)
  }

  concatWithLengthForRlp(decompressedBytes: Uint8Array) {
    const totalLength = decompressedBytes.length
    const lengthBytes = numberToByteArr(totalLength)
    const lengthBytesLength = lengthBytes.length
    const lengthByte = 0xf7 + lengthBytesLength
    const lengthByteBytes = numberToByteArr(lengthByte)
    const concatenatedWithLength = new Uint8Array([
      ...lengthByteBytes,
      ...lengthBytes,
      ...decompressedBytes,
    ])
    return concatenatedWithLength
  }
}
