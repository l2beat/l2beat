import { UnixTime } from '@l2beat/shared-pure'

export type GasFeesChainId = (typeof GAS_FEES_CHAINS)[number]['id']

export interface GasFeesChainConfig {
  /** The chain's id in the backend's GasFeesDaily, and its project id */
  id: string
  type: string
  gasToken: 'ETH' | 'MNT'
  /**
   * The gas a transaction is charged for holds the gas for posting its data to
   * Ethereum, so the stored base fee already contains the L1 fee. With a day,
   * only before it.
   */
  l1FeeInGas?: true | { until: UnixTime }
  /** The sequencer takes no tips, so all that is not the L1 fee is the chain's own fee */
  noPriorityFees?: true
  /** A charge per gas the chain sets on top of its base fee, in gwei of its gas token */
  operatorFee?: { from: UnixTime; gweiPerGas: number }
}

const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))

/**
 * The chains the gas fees page tracks, Ethereum first. Order sets colors.
 * How each chain charges follows the backend's fee rules
 * (packages/backend/src/modules/gas-fees/fees/feeRules.ts).
 */
export const GAS_FEES_CHAINS = [
  { id: 'ethereum', type: 'Layer 1', gasToken: 'ETH' },
  {
    id: 'arbitrum',
    type: 'Optimistic rollup',
    gasToken: 'ETH',
    l1FeeInGas: true,
  },
  { id: 'base', type: 'Optimistic rollup', gasToken: 'ETH' },
  { id: 'optimism', type: 'Optimistic rollup', gasToken: 'ETH' },
  { id: 'zksync2', type: 'ZK rollup', gasToken: 'ETH', noPriorityFees: true },
  { id: 'linea', type: 'ZK rollup', gasToken: 'ETH' },
  { id: 'scroll', type: 'ZK rollup', gasToken: 'ETH' },
  { id: 'unichain', type: 'Optimistic rollup', gasToken: 'ETH' },
  { id: 'ink', type: 'Optimistic rollup', gasToken: 'ETH' },
  { id: 'abstract', type: 'ZK rollup', gasToken: 'ETH', noPriorityFees: true },
  { id: 'taiko', type: 'Based rollup', gasToken: 'ETH' },
  // Mantle changed how it charges during 22 April 2026, so that day's split is approximate
  {
    id: 'mantle',
    type: 'Optimium',
    gasToken: 'MNT',
    l1FeeInGas: { until: day('2026-04-22') },
    operatorFee: { from: day('2026-04-23'), gweiPerGas: 10 },
  },
] as const satisfies readonly GasFeesChainConfig[]

/** Why a chain has no priority fees, shown wherever its split is */
export const NO_PRIORITY_FEE_NOTES: Partial<Record<GasFeesChainId, string>> = {
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
  mantle: {
    base: "Mantle's base fee and, since 22 April 2026, its operator fee: a fixed charge per gas.",
  },
}
