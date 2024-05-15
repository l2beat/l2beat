import { assert } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'

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

export class ArbitrumSequencerVersionHandler implements ClassicHandler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ArbitrumSequencerVersionDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
    _previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Checking Arbitrum Sequencer Version',
    ])

    const lastEvents = await provider.getLogs(
      address,
      [[abi.getEventTopic('SequencerBatchDelivered')]],
      0,
      blockNumber,
      {
        howManyEvents: 1,
        filter: (log): boolean => {
          const decoded = abi.parseLog(log)
          assert(
            decoded.name === 'SequencerBatchDelivered',
            'Unexpected event name',
          )
          return decoded.args.dataLocation === 0
        },
        maxRange: 1000,
      },
    )
    const lastEvent = lastEvents[0]
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
}
