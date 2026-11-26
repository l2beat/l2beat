import type { GasFeesWallet, GasFeesWalletTipRecord } from '@l2beat/database'
import { v } from '@l2beat/validate'

export type WalletTip = Omit<GasFeesWalletTipRecord, 'readAt'>

export const METAMASK_FEES =
  'https://gas.api.cx.metamask.io/networks/1/suggestedGasFees'
export const RABBY_FEES =
  'https://api.rabby.io/v1/wallet/gas_market?chain_id=eth'

const MetaMaskOption = v.object({ suggestedMaxPriorityFeePerGas: v.string() })
const MetaMaskFees = v.object({
  low: MetaMaskOption,
  medium: MetaMaskOption,
  high: MetaMaskOption,
})

/** MetaMask's fee service answers in gwei */
export function parseMetaMask(json: unknown): WalletTip[] {
  const fees = MetaMaskFees.parse(json)
  return withWallet('MetaMask', [
    { option: 'low', tier: 'slow', tipGwei: gwei(fees.low) },
    { option: 'medium', tier: 'medium', tipGwei: gwei(fees.medium) },
    { option: 'high', tier: 'fast', tipGwei: gwei(fees.high) },
  ])
}

function gwei(option: v.infer<typeof MetaMaskOption>) {
  const tip = Number(option.suggestedMaxPriorityFeePerGas)
  if (!Number.isFinite(tip)) {
    throw new Error('Wallet tip malformed', { cause: { option } })
  }
  return tip
}

const RabbyLevels = v.array(
  v.object({ level: v.string(), priority_price: v.number().optional() }),
)

/** Rabby's fee service answers in wei */
export function parseRabby(json: unknown): WalletTip[] {
  const levels = RabbyLevels.parse(json)
  const tip = (level: string) => {
    const wei = levels.find((row) => row.level === level)?.priority_price
    if (wei === undefined) {
      throw new Error('Wallet option missing', { cause: { level } })
    }
    return wei / 1e9
  }
  return withWallet('Rabby', [
    { option: 'slow', tier: 'slow', tipGwei: tip('slow') },
    { option: 'normal', tier: 'medium', tipGwei: tip('normal') },
    { option: 'fast', tier: 'fast', tipGwei: tip('fast') },
  ])
}

/** From ambire-common src/libs/gasPrice/gasPrice.ts, as of Oct 2026 */
export const AMBIRE_BLOCKS = 3
export const AMBIRE_PERCENTILES = [25, 50, 72]
const AMBIRE_MIN_TIP_GWEI = 0.0001
const AMBIRE_MIN_STEP = 1.25

/**
 * Ambire's open source rule, run on our node. `rewards` holds the last
 * AMBIRE_BLOCKS blocks' tips at AMBIRE_PERCENTILES, gwei; `nodeTipGwei` is the
 * node's eth_maxPriorityFeePerGas. Each speed is at least 25% above the last.
 */
export function computeAmbire(
  rewards: number[][],
  nodeTipGwei: number,
): WalletTip[] {
  const medians = AMBIRE_PERCENTILES.map((_, column) =>
    median(rewards.map((row) => row[column] ?? 0).filter((tip) => tip > 0)),
  )
  const slow = Math.max(medians[0] ?? 0, nodeTipGwei, AMBIRE_MIN_TIP_GWEI)
  const medium = Math.max(medians[1] ?? 0, slow * AMBIRE_MIN_STEP)
  const fast = Math.max(medians[2] ?? 0, medium * AMBIRE_MIN_STEP)
  return withWallet('Ambire', [
    { option: 'slow', tier: 'slow', tipGwei: slow },
    { option: 'medium', tier: 'medium', tipGwei: medium },
    { option: 'fast', tier: 'fast', tipGwei: fast },
  ])
}

function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[middle] ?? 0)
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
}

function withWallet(
  wallet: GasFeesWallet,
  tips: Omit<WalletTip, 'wallet'>[],
): WalletTip[] {
  return tips.map((tip) => ({ ...tip, wallet }))
}
