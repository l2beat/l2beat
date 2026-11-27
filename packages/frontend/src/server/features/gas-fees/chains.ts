import { GAS_FEES_CHAIN_IDS, type GasFeesChainId } from '@l2beat/shared-pure'

/** The fee chart's series: a chain each, then the L2s combined */
export const GAS_FEES_CHART_KEYS = [...GAS_FEES_CHAIN_IDS, 'l2s'] as const
export type GasFeesChartKey = (typeof GAS_FEES_CHART_KEYS)[number]

export const GAS_FEES_L2S = GAS_FEES_CHAIN_IDS.filter((c) => c !== 'ethereum')

export function isGasFeesChain(chain: string): chain is GasFeesChainId {
  return (GAS_FEES_CHAIN_IDS as readonly string[]).includes(chain)
}

export const ACTION_GAS = {
  transfer: 21_000,
  erc20: 46_109,
  swap: 123_119,
} as const

/** What a tip adds to an ERC-20 transfer, USD */
export function tipToUsd(gwei: number, ethUsd: number): number {
  return gwei * ACTION_GAS.erc20 * 1e-9 * ethUsd
}
