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
