import { GAS_FEES_CHAINS, type GasFeesChainId } from './chains'
import { getMockGasFees, getMockRecentGasFees } from './mock/getMockGasFees'
import { median } from './summarize'

export interface GasFeesRecent {
  /** Starts of the last 24 full UTC hours, oldest first */
  hours: number[]
  ethereum: { baseFeeGwei: number[]; priorityFeeGwei: number[] }
  chains: {
    id: GasFeesChainId
    /** Average fee per transaction in USD, per hour */
    avgFee: number[]
    /** The median daily average fee of the past 30 days */
    usual: number
  }[]
}

export function getGasFeesRecent(): GasFeesRecent {
  // Fake data until fees are tracked: see getMockGasFees
  const recent = getMockRecentGasFees()
  const daily = getMockGasFees()
  return {
    hours: recent.hours,
    ethereum: recent.ethereum,
    chains: GAS_FEES_CHAINS.flatMap((chain) => {
      const avgFee = recent.avgFee.get(chain.id)
      const usual = median(
        (daily.get(chain.id) ?? [])
          .slice(-30)
          .map((r) => r.totalFees / r.txCount),
      )
      return avgFee && usual !== undefined
        ? [{ id: chain.id, avgFee, usual }]
        : []
    }),
  }
}
