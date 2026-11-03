/** The chains the gas fees page tracks, Ethereum first. Order sets colors. */
export const GAS_FEES_CHAINS = [
  { id: 'ethereum', type: 'Layer 1' },
  { id: 'arbitrum', type: 'Optimistic rollup' },
  { id: 'base', type: 'Optimistic rollup' },
  { id: 'optimism', type: 'Optimistic rollup' },
  { id: 'zksync2', type: 'ZK rollup' },
  { id: 'linea', type: 'ZK rollup' },
  { id: 'scroll', type: 'ZK rollup' },
  { id: 'starknet', type: 'ZK rollup' },
  { id: 'unichain', type: 'Optimistic rollup' },
] as const

export type GasFeesChainId = (typeof GAS_FEES_CHAINS)[number]['id']

/** Why a chain has no priority fees, shown wherever its split is */
export const NO_PRIORITY_FEE_NOTES: Partial<Record<GasFeesChainId, string>> = {
  arbitrum:
    'Arbitrum ignores priority tips: the sequencer orders transactions first come, first served.',
  zksync2:
    'ZKsync Era has no priority fees: the sequencer orders transactions first come, first served.',
}
