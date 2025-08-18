import {
  type ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'

const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]

const iface = new utils.Interface(abi)
const topics = iface.encodeFilterTopics('Transfer', [EthereumAddress.ZERO])

const limit = 1000
const batchSize = 100

export type ERC20MintersDefinition = v.infer<typeof ERC20MintersDefinition>
export const ERC20MintersDefinition = v.strictObject({
  type: v.literal('ERC20Minters'),
  noLimit: v.boolean().optional(),
})

export class ERC20MintersHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ERC20MintersDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, topics)
    const txHashes = logs.map((l) => l.transactionHash)
    if (!this.definition.noLimit && txHashes.length > limit) {
      throw new Error(
        `ERC20MintersHandler: too many transactions, ignore limit explicitly to override: ${txHashes.length} > ${limit}`,
      )
    }

    const batches = toBatches(txHashes, batchSize)

    const origins = new Set<string>()

    for (const batch of batches) {
      const txs = await Promise.all(
        batch.map((h) => provider.getTransaction(Hash256(h))),
      )
      for (const tx of txs) {
        if (tx?.from) {
          origins.add(tx.from)
        }
      }
    }

    return {
      field: this.field,
      value: Array.from(origins),
    }
  }
}

function toBatches(txHashes: string[], batchSize: number): string[][] {
  const batches = []
  for (let i = 0; i < txHashes.length; i += batchSize) {
    batches.push(txHashes.slice(i, i + batchSize))
  }
  return batches
}
