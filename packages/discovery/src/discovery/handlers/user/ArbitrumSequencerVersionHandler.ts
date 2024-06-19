import { assert } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'

export type ArbitrumSequencerVersionDefinition = z.infer<
  typeof ArbitrumSequencerVersionDefinition
>
export const ArbitrumSequencerVersionDefinition = z.strictObject({
  type: z.literal('arbitrumSequencerVersion'),
})

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

    const decodedFunction = this.decodeCalldata(tx.data)
    const batchData = Bytes.fromHex(decodedFunction[1] as string)

    return {
      field: this.field,
      value: batchData.slice(0, 1).toString(),
    }
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
        ({ eventProvider }) => {
          return eventProvider.getLogs({
            address: address.toString(),
            topics: [abi.getEventTopic('SequencerBatchDelivered')],
            fromBlock: Math.max(0, currentBlockNumber - blockStep),
            toBlock: currentBlockNumber,
          })
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
        if (decoded.args.dataLocation === 0) {
          return last
        }
      }
    }

    return undefined
  }
}
