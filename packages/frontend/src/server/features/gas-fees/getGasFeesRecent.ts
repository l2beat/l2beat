import { GAS_FEES_CHAINS, type GasFeesChainId, type GasUnit } from './chains'
import { getMockGasFees, getMockRecentGasFees } from './mock/getMockGasFees'
import { median } from './summarize'

export interface GasFeesRecent {
  /** Starts of the last 24 full UTC hours, oldest first */
  hours: number[]
  chains: GasFeesRecentChain[]
}

export interface GasFeesRecentChain {
  id: GasFeesChainId
  gasToken: string
  gasUnit: GasUnit
  /** Median fee per transaction in USD, per hour */
  usd: GasFeesRecentSeries
  /** Base + priority fee per gas in gasUnit, per hour */
  gas: GasFeesRecentSeries & {
    baseFee: number[]
    /** null on chains without priority fees */
    priorityFee: number[] | null
  }
}

export interface GasFeesRecentSeries {
  values: number[]
  /** The median daily value of the past 30 days */
  usual: number
}

export function getGasFeesRecent(): GasFeesRecent {
  // A Dune snapshot until fees are tracked: see getMockGasFees
  const recent = getMockRecentGasFees()
  const daily = getMockGasFees()
  return {
    hours: recent.hours,
    chains: GAS_FEES_CHAINS.flatMap((chain) => {
      const hourly = recent.chains.get(chain.id)
      const records = (daily.get(chain.id) ?? []).slice(-30)
      const usualUsd = median(records.map((r) => r.medianFee))
      const usualGas = median(records.map((r) => r.gasPrice))
      if (!hourly || usualUsd === undefined || usualGas === undefined) {
        return []
      }
      return [
        {
          id: chain.id,
          gasToken: chain.gasToken,
          gasUnit: chain.gasUnit,
          usd: { values: hourly.medianFee, usual: usualUsd },
          gas: {
            values: hourly.baseFee.map(
              (base, i) => base + (hourly.priorityFee?.[i] ?? 0),
            ),
            usual: usualGas,
            baseFee: hourly.baseFee,
            priorityFee: hourly.priorityFee,
          },
        },
      ]
    }),
  }
}
