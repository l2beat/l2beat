/** The chains the gas fees page tracks, Ethereum first. Order sets colors. */
export const GAS_FEES_CHAINS = [
  { id: 'ethereum', type: 'Layer 1', gasToken: 'ETH', gasUnit: 'gwei' },
  {
    id: 'arbitrum',
    type: 'Optimistic rollup',
    gasToken: 'ETH',
    gasUnit: 'gwei',
  },
  { id: 'base', type: 'Optimistic rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  {
    id: 'optimism',
    type: 'Optimistic rollup',
    gasToken: 'ETH',
    gasUnit: 'gwei',
  },
  { id: 'zksync2', type: 'ZK rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  { id: 'linea', type: 'ZK rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  { id: 'scroll', type: 'ZK rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  {
    id: 'unichain',
    type: 'Optimistic rollup',
    gasToken: 'ETH',
    gasUnit: 'gwei',
  },
  { id: 'ink', type: 'Optimistic rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  { id: 'abstract', type: 'ZK rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  { id: 'taiko', type: 'Based rollup', gasToken: 'ETH', gasUnit: 'gwei' },
  { id: 'mantle', type: 'Optimium', gasToken: 'MNT', gasUnit: 'gwei' },
] as const

/** Gas prices are in these units of the chain's gas token */
export const GAS_UNIT_DECIMALS = { gwei: 9, fri: 18 } as const
export type GasUnit = keyof typeof GAS_UNIT_DECIMALS

export type GasFeesChainId = (typeof GAS_FEES_CHAINS)[number]['id']

/** Why a chain has no priority fees, shown wherever its split is */
export const NO_PRIORITY_FEE_NOTES: Partial<Record<GasFeesChainId, string>> = {
  arbitrum:
    'Arbitrum ignores priority tips: the sequencer orders transactions first come, first served.',
  zksync2:
    'ZKsync Era has no priority fees: the sequencer orders transactions first come, first served.',
  abstract:
    'Abstract has no priority fees: the sequencer orders transactions first come, first served.',
}

export type FeeSplitPartKey = 'base' | 'priority' | 'l1Data'

/**
 * How each part of a fee works on the chain, under its value in the table's
 * split tooltip. A chain or part without a note shows the value alone.
 */
export const FEE_SPLIT_NOTES: Partial<
  Record<GasFeesChainId, Partial<Record<FeeSplitPartKey, string>>>
> = {
  ethereum: {
    base: 'Set by the protocol for each block, up or down with how full the last block was, and burned.',
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
}

/** What a priority fee buys on each chain */
export const TIP_ROLES: Record<GasFeesChainId, string> = {
  ethereum: 'Sets position',
  arbitrum: 'Ignored',
  base: 'Sets position',
  optimism: 'Sets position',
  zksync2: 'Ignored',
  // The base fee is pinned at 7 wei
  linea: 'Is the price',
  scroll: 'Sets position',
  unichain: 'Sets position',
  ink: 'Sets position',
  abstract: 'Ignored',
  taiko: 'Buys preconfirmation',
  mantle: 'Sets position',
}
