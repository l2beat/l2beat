import type { EthereumAddress } from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import { rpcWithRetries } from '../../provider/LowLevelProvider'
import type { Handler, HandlerResult } from '../Handler'

export type OrbitPostsBlobsDefinition = z.infer<
  typeof OrbitPostsBlobsDefinition
>
export const OrbitPostsBlobsDefinition = z.strictObject({
  type: z.literal('orbitPostsBlobs'),
})

const DATA_LOCATION_IN_BLOBS = 3

const abi = new utils.Interface([
  'event SequencerBatchDelivered(uint256 indexed batchSequenceNumber, bytes32 indexed beforeAcc, bytes32 indexed afterAcc, bytes32 delayedAcc, uint256 afterDelayedMessagesRead, tuple(uint64, uint64, uint64, uint64) timeBounds, uint8 dataLocation)',
])

export class OrbitPostsBlobsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OrbitPostsBlobsDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const lastEvents =
      (await this.getLast10Events(provider, address, provider.blockNumber)) ??
      []

    const decoded = lastEvents.map((e) => abi.parseLog(e))
    const last10BatchesPostedToBlobs = decoded.every(
      (e) => e.args.dataLocation === DATA_LOCATION_IN_BLOBS,
    )

    return {
      field: this.field,
      value: last10BatchesPostedToBlobs,
    }
  }

  async getLast10Events(
    provider: IProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<providers.Log[] | undefined> {
    let currentBlockNumber = blockNumber
    const blockStep = 1000
    let multiplier = 1
    const fetchedEvents: providers.Log[] = []
    while (currentBlockNumber > 0) {
      const events = await provider.raw(
        `arbitrum_sequencer_batches.${address}.${Math.max(
          0,
          currentBlockNumber - blockStep * multiplier,
        )}.${currentBlockNumber}`,
        async ({ eventProvider }) => {
          const fromBlock = Math.max(
            0,
            currentBlockNumber - blockStep * multiplier,
          )
          return await rpcWithRetries(async () => {
            return await eventProvider.getLogs({
              address: address.toString(),
              topics: [abi.getEventTopic('SequencerBatchDelivered')],
              fromBlock,
              toBlock: currentBlockNumber,
            })
          }, `getLogs ${address.toString()} ${fromBlock} - ${currentBlockNumber}`)
        },
      )
      currentBlockNumber -= blockStep * multiplier

      if (events.length === 0) {
        multiplier += 1
      } else {
        multiplier = 1
      }

      fetchedEvents.push(...events)
      if (fetchedEvents.length >= 10) {
        return fetchedEvents.slice(0, 10)
      }
    }

    return undefined
  }
}
