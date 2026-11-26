import type { GasFeesDailyRecord } from '@l2beat/database'
import { type GasFeesChainConfig, hasL1FeeInGas } from './chains'
import { GAS_PER_ACTION, type GasFeesRecord } from './types'

/**
 * A stored day in USD, split into what the chain sets, tips and the L1 fee.
 * The backend stores raw sums in the chain's gas token, so every per-gas and
 * per-transaction figure is derived here.
 */
export function toGasFeesRecord(
  row: GasFeesDailyRecord,
  chain: GasFeesChainConfig,
): GasFeesRecord {
  // Dune's price of the gas token, weighted by the fees paid in each hour
  const tokenUsd =
    row.totalFeeNative > 0 ? row.totalFeeUsd / row.totalFeeNative : 0
  const l1InGas = hasL1FeeInGas(chain, row.timestamp)
  const operatorFee =
    chain.operatorFee && row.timestamp >= chain.operatorFee.from
      ? row.gasUsed * chain.operatorFee.gweiPerGas * 1e-9
      : 0

  const l1 = row.l1FeeNative
  const notL1 = Math.max(0, row.totalFeeNative - l1)
  // Blobs are priced by the protocol and burned, like the base fee. A chain with no base fee has only bids
  const chainSet =
    Math.max(0, (row.baseFeeNative ?? 0) - (l1InGas ? l1 : 0)) +
    row.blobFeeNative +
    operatorFee
  const base = chain.noPriorityFees ? notL1 : Math.min(chainSet, notL1)

  // What is paid per gas: not the blobs, and not an L1 fee charged on top of the gas
  const forGas = row.totalFeeNative - row.blobFeeNative - (l1InGas ? 0 : l1)
  const hasPrices = row.txCount > 0 && row.gasUsed > 0
  const perGas = hasPrices ? forGas / row.gasUsed : null
  const basePerGas = hasPrices ? (row.baseFeeNative ?? 0) / row.gasUsed : null
  const tipPerGas =
    perGas === null || basePerGas === null || chain.noPriorityFees
      ? null
      : Math.max(0, perGas - basePerGas - operatorFee / row.gasUsed)
  const action = (gas: number) =>
    perGas === null ? null : (gas * perGas + l1 / row.txCount) * tokenUsd

  return {
    timestamp: row.timestamp,
    txCount: row.txCount,
    gasUsed: row.gasUsed,
    totalFees: row.totalFeeUsd,
    baseFees: base * tokenUsd,
    priorityFees: chain.noPriorityFees ? null : (notL1 - base) * tokenUsd,
    l1DataFees: Math.min(l1, row.totalFeeNative) * tokenUsd,
    medianFee: row.txCount > 0 ? row.medianFeeUsd : null,
    transfer: action(GAS_PER_ACTION.transfer),
    erc20: action(GAS_PER_ACTION.erc20),
    swap: action(GAS_PER_ACTION.swap),
    gasPrice: toGwei(perGas),
    baseFeePerGas: toGwei(basePerGas),
    priorityFeePerGas: toGwei(tipPerGas),
  }
}

function toGwei(native: number | null) {
  return native === null ? null : native * 1e9
}
