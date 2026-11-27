import type { GasFeesChainId } from '../chains'
import type { GasFeesDay } from '../daily/getGasFeesDays'
import { utcDay } from '../days'

/** 10 transactions paying 10 ETH, $2,000 an ETH, 2 of it L1 fee and 5 base fee */
export function mockDay(
  chain: GasFeesChainId,
  overrides: Partial<GasFeesDay> = {},
): GasFeesDay {
  return {
    timestamp: utcDay('2026-01-01'),
    chain,
    txCount: 10,
    totalFeeNative: 10,
    totalFeeUsd: 20_000,
    l1FeeNative: 2,
    blobFeeNative: 0,
    baseFeeNative: 5,
    gasUsed: 1e9,
    medianFeeUsd: 1,
    ...overrides,
  }
}
