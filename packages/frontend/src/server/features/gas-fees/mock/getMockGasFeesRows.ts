import type { GasFeesDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_CHAINS, hasL1FeeInGas } from '../chains'

const DAYS = 400
/** Nothing like the real prices: only the gap between Ethereum and the L2s is kept */
const TOKEN_USD = { ETH: 2_000, MNT: 0.5 }

let cached: { lastDay: number; rows: GasFeesDailyRecord[] } | undefined

/** Stored days as the backend would have them, ending yesterday, which the last chain doesn't have yet */
export function getMockGasFeesRows(): GasFeesDailyRecord[] {
  const lastDay = UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY
  if (cached?.lastDay === lastDay) return cached.rows

  const rows: GasFeesDailyRecord[] = []
  GAS_FEES_CHAINS.forEach((chain, i) => {
    const isEthereum = chain.id === 'ethereum'
    const gasPerTx = isEthereum ? 100_000 : 200_000
    // A cheaper gas token takes more of it per gas
    const baseFeePerGas =
      ((isEthereum ? 4e-10 : 2e-11) * TOKEN_USD.ETH) / TOKEN_USD[chain.gasToken]
    for (let d = DAYS - 1; d >= 0; d--) {
      if (d === 0 && i === GAS_FEES_CHAINS.length - 1) continue
      const timestamp = UnixTime(lastDay - d * UnixTime.DAY)
      const txCount = Math.round((1 + Math.random()) * (1_000_000 / (i + 1)))
      const gasUsed = txCount * gasPerTx
      const baseFeeNative = gasUsed * baseFeePerGas * (0.5 + Math.random())
      const tips = chain.id === 'zksync2' ? 0 : baseFeeNative * Math.random()
      const l1FeeNative = isEthereum ? 0 : baseFeeNative * 0.1 * Math.random()
      const totalFeeNative = baseFeeNative + tips + l1FeeNative
      const totalFeeUsd = totalFeeNative * TOKEN_USD[chain.gasToken]
      rows.push({
        timestamp,
        chain: chain.id,
        txCount,
        totalFeeNative,
        totalFeeUsd,
        l1FeeNative,
        blobFeeNative: 0,
        // As the backend stores it where the gas holds the L1 fee
        baseFeeNative: hasL1FeeInGas(chain, timestamp)
          ? baseFeeNative + l1FeeNative
          : baseFeeNative,
        gasUsed,
        medianFeeUsd: (totalFeeUsd / txCount) * 0.4,
      })
    }
  })
  cached = { lastDay, rows }
  return rows
}
