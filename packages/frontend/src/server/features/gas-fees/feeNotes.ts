import type { GasFeesChainId } from './chains'

/** What a part of a chain's fee split is, where it differs from the general key */
export interface FeeNotes {
  base?: string
  priority?: string
  l1Data?: string
}

export const FEE_NOTES: Partial<Record<GasFeesChainId, FeeNotes>> = {
  ethereum: {
    base: 'Set by the protocol for each block, up or down with how full the last block was, and burned. Includes what blob transactions pay for their blobs.',
    priority:
      'A tip to the block builder on top of the base fee. When blocks are full, a higher tip gets a transaction in sooner.',
  },
  optimism: {
    base: "OP Mainnet's own execution fee. Set like Ethereum's, from how full recent blocks were, but paid to the chain instead of burned.",
    priority:
      'A tip to the sequencer, which puts higher tips first when blocks are full.',
    l1Data:
      "The cost of posting the transaction's data to Ethereum: its compressed size times Ethereum's blob and base fees, scaled by the chain's settings.",
  },
  zksync2: {
    priority:
      'ZKsync Era has no priority fees: the sequencer orders transactions first come, first served.',
  },
  abstract: {
    priority:
      'Abstract has no priority fees: the sequencer orders transactions first come, first served.',
  },
  mantle: {
    base: "Mantle's base fee and, since 22 April 2026, its operator fee: a fixed charge per gas.",
  },
}
