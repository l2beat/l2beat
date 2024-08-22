import { assert, Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { rpcWithRetries } from '../../provider/LowLevelProvider'
import { Handler, HandlerResult } from '../Handler'

export type ArbitrumSequencerVersionDefinition = z.infer<
  typeof ArbitrumSequencerVersionDefinition
>
export const ArbitrumSequencerVersionDefinition = z.strictObject({
  type: z.literal('arbitrumSequencerVersion'),
})

const DATA_LOCATION_IN_TX = 0
const DATA_LOCATION_IN_BLOBS = 3

const addSequencerBatchV1 =
  'addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes calldata data, uint256 afterDelayedMessagesRead, address gasRefunder)'
const addSequencerBatchV2 =
  'addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes calldata data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount)'

const abi = new utils.Interface([
  'event SequencerBatchDelivered(uint256 indexed batchSequenceNumber, bytes32 indexed beforeAcc, bytes32 indexed afterAcc, bytes32 delayedAcc, uint256 afterDelayedMessagesRead, tuple(uint64, uint64, uint64, uint64) timeBounds, uint8 dataLocation)',
  `function ${addSequencerBatchV1}`,
  `function ${addSequencerBatchV2}`,
])

const addSequencerBatchV1SigHash = abi.getSighash(addSequencerBatchV1)
const addSequencerBatchV2SigHash = abi.getSighash(addSequencerBatchV2)

export class ArbitrumSequencerVersionHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ArbitrumSequencerVersionDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Checking Arbitrum Sequencer Version',
    ])

    const lastEvent = await this.getLastEventWithTxInput(
      provider,
      address,
      provider.blockNumber,
    )
    assert(lastEvent !== undefined, 'No event found')

    const tx = await provider.getTransaction(Hash256(lastEvent.transactionHash))
    if (!tx) {
      return {
        field: this.field,
        error: 'Transaction not found',
      }
    }

    const decoded = abi.parseLog(lastEvent)
    assert(decoded.name === 'SequencerBatchDelivered', 'Unexpected event name')
    const isInTx = decoded.args.dataLocation === DATA_LOCATION_IN_TX
    const isInBlobs = decoded.args.dataLocation === DATA_LOCATION_IN_BLOBS
    assert(isInTx || isInBlobs, 'Unexpected data location')

    let versionByte: string | undefined
    if (isInTx) {
      const decodedFunction = this.decodeCalldata(tx.data)
      versionByte = Bytes.fromHex(decodedFunction[1] as string)
        .slice(0, 1)
        .toString()
    } else {
      const blockBlobs = await provider.getBlobs(tx.hash)
      versionByte = this.decodeVersionByteFromBlobs(
        blockBlobs.blobs.map((blob) => blob.data),
      )
    }

    if (versionByte === undefined) {
      throw new Error('Batch data is expected to be set')
    }

    return {
      field: this.field,
      value: versionByte,
    }
  }

  decodeVersionByteFromBlobs(blobs: string[]): string {
    const firstBlob = blobs[0]
    assert(firstBlob !== undefined, 'No relevant blobs found')

    // Please read the code of arbitrum to understand the following logic
    // https://github.com/OffchainLabs/nitro/blob/f93d2c38ae438066fd46c529694582c57bec4848/util/blobs/blobs.go#L79-L80
    //
    // High level explanation:
    // Blobs are really 4096 points on a BLS curve. Points are 254bit
    // integers (32 bytes) stored in big endian fashion. The first 32 bytes
    // are the first point. The first byte of every point is encoding data
    // from the end of the stream. This is Arbitrum specific! The following
    // 31 bytes are sequentally encoding the stream. Taking the first point,
    // dropping the first byte leaves us with 31 bytes from the begging of
    // the stream. Stream is RLP encoded. The first byte indicates that the
    // following data is a string with n-bytes following describing the length.
    // The first byte of the first element of the list is the version byte.
    //
    // This implementation is dropping everything, and it does not verify if
    // the blobs concatenated are valid RLP. We look at the first point in
    // the first blob.
    const point = Bytes.fromHex(firstBlob).slice(0, 32)
    const stream = point.slice(1, 32)

    const firstByte = stream.get(0)
    assert(firstByte >= 128, 'RLP encodes a single number, not a string')

    if (firstByte < 128 + 56) {
      return stream.slice(1, 2).toString()
    }

    if (firstByte < 192) {
      const lengthOfLength = firstByte - 183
      const index = 1 + lengthOfLength
      return stream.slice(index, index + 1).toString()
    }

    throw new Error(`Unexpected first byte ${firstByte}, cannot decode as RLP`)
  }

  decodeCalldata(calldata: string): utils.Result {
    if (calldata.startsWith(addSequencerBatchV1SigHash)) {
      return abi.decodeFunctionData(addSequencerBatchV1, calldata)
    } else if (calldata.startsWith(addSequencerBatchV2SigHash)) {
      return abi.decodeFunctionData(addSequencerBatchV2, calldata)
    } else {
      throw new Error(`Unexpected function signature ${calldata.slice(0, 10)}}`)
    }
  }

  async getLastEventWithTxInput(
    provider: IProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<providers.Log | undefined> {
    let currentBlockNumber = blockNumber
    const blockStep = 1000
    while (currentBlockNumber > 0) {
      const events = await provider.raw(
        `arbitrum_sequencer_batches.${address}.${Math.max(
          0,
          currentBlockNumber - blockStep,
        )}.${currentBlockNumber}`,
        async ({ eventProvider }) => {
          const fromBlock = Math.max(0, currentBlockNumber - blockStep)
          return await rpcWithRetries(
            async () => {
              return await eventProvider.getLogs({
                address: address.toString(),
                topics: [abi.getEventTopic('SequencerBatchDelivered')],
                fromBlock,
                toBlock: currentBlockNumber,
              })
            },
            () =>
              `getLogs ${address.toString()} ${fromBlock} - ${currentBlockNumber}`,
          )
        },
      )
      currentBlockNumber -= blockStep

      while (events.length > 0) {
        const last = events.pop()
        if (last === undefined) {
          break
        }

        const decoded = abi.parseLog(last)
        assert(
          decoded.name === 'SequencerBatchDelivered',
          'Unexpected event name',
        )

        const isInTx = decoded.args.dataLocation === DATA_LOCATION_IN_TX
        const isInBlobs = decoded.args.dataLocation === DATA_LOCATION_IN_BLOBS
        if (isInTx || isInBlobs) {
          return last
        }
      }
    }

    return undefined
  }
}
