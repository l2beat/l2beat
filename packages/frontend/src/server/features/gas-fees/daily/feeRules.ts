import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesChainId } from '../chains'
import type { GasFeesDay } from './getGasFeesDays'

const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))
/** Until this day Mantle's gas held the cost of posting data to Ethereum */
const MANTLE_L1_FEE_APART_FROM = day('2026-04-22')
// It began during 22 April; a day can't be split, so from the first whole day
const MANTLE_OPERATOR_FEE_FROM = day('2026-04-23')
/** 10 gwei a gas, in MNT */
const MANTLE_OPERATOR_FEE_PER_GAS = 10e-9

/** First come, first served: there is no tip to pay */
function hasPriorityFees(chain: GasFeesChainId): boolean {
  return chain !== 'zksync2' && chain !== 'abstract'
}

/** Whether the stored base fee and the gas price already hold the L1 fee */
function l1FeeInGas(d: GasFeesDay): boolean {
  return (
    d.chain === 'arbitrum' ||
    (d.chain === 'mantle' && d.timestamp < MANTLE_L1_FEE_APART_FROM)
  )
}

function operatorFee(d: GasFeesDay): number {
  return d.chain === 'mantle' && d.timestamp >= MANTLE_OPERATOR_FEE_FROM
    ? d.gasUsed * MANTLE_OPERATOR_FEE_PER_GAS
    : 0
}

/** An L1 fee charged on top of the gas, gas token */
function l1FeeOnTop(d: GasFeesDay): number {
  return l1FeeInGas(d) ? 0 : d.l1FeeNative
}

/** The day's fees in three parts that add up to the total, gas token */
export interface FeeSplit {
  /** Set by the chain: base fee, Ethereum's blobs, Mantle's operator fee */
  base: number
  /** null where the chain has no priority fees */
  priority: number | null
  l1Data: number
}

export function splitFees(d: GasFeesDay): FeeSplit {
  const l1Data = d.l1FeeNative
  if (!hasPriorityFees(d.chain)) {
    return { base: d.totalFeeNative - l1Data, priority: null, l1Data }
  }
  const base =
    (d.baseFeeNative ?? 0) -
    (l1FeeInGas(d) ? l1Data : 0) +
    d.blobFeeNative +
    operatorFee(d)
  return { base, priority: d.totalFeeNative - l1Data - base, l1Data }
}

/** Gas token per gas; undefined on a day without transactions */
interface PerGasPrices {
  gasPrice: number
  baseFee: number
  priorityFee: number | null
}

export function getPerGasPrices(d: GasFeesDay): PerGasPrices | undefined {
  if (d.txCount === 0 || d.gasUsed === 0) return undefined
  const gasPrice =
    (d.totalFeeNative - d.blobFeeNative - l1FeeOnTop(d)) / d.gasUsed
  // As stored: where the gas holds the L1 fee, the gas that pays for it pays the base fee too
  const baseFee = ((d.baseFeeNative ?? 0) + operatorFee(d)) / d.gasUsed
  return {
    gasPrice,
    baseFee,
    priorityFee: hasPriorityFees(d.chain) ? gasPrice - baseFee : null,
  }
}

/** USD per gas token, from what the day's fees were worth */
export function usdPerToken(d: GasFeesDay): number | undefined {
  return d.totalFeeNative > 0 ? d.totalFeeUsd / d.totalFeeNative : undefined
}
