import type {
  GasFeesTier,
  GasFeesTierWaitTotal,
  GasFeesTipHourlyRecord,
  GasFeesTipLevelWaitTotal,
  GasFeesTipPayersDailyRecord,
  GasFeesWallet,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { eachDay } from '../days'
import type { GasFeesLiveTips } from '../tipping/getGasFeesLiveTips'
import type { TippingInputs } from '../tipping/getGasFeesTipping'
import { jitter, seededNoise } from './seededNoise'

const TIERS: Record<GasFeesTier, number> = {
  slow: 0.0000047,
  medium: 0.01,
  fast: 0.03,
}
/** Over a year the hourly fast tip ran higher than it is now */
const HOURLY_FAST = 0.3
const TIER_WAIT_SECONDS: Record<GasFeesTier, number> = {
  slow: 55,
  medium: 30,
  fast: 25,
}

export function getMockTippingInputs(
  from: UnixTime,
  to: UnixTime,
): TippingInputs {
  const days = eachDay(from, to)
  const ethUsd = (ts: number) => 3000 + 800 * Math.sin(ts / (40 * UnixTime.DAY))
  return {
    payers: days.map((timestamp) =>
      mockPayersDay(timestamp, ethUsd(timestamp)),
    ),
    mempoolDays: days.map((timestamp) => ({
      timestamp,
      status: seededNoise('mempool', timestamp) < 0.02 ? 'partial' : 'complete',
      duneLandedCount: 900_000,
      flashbotsLandedCount: 905_000,
      keptCount: 700_000,
    })),
    levelWaits: mockLevelWaits(),
    tierWaits: (Object.keys(TIERS) as GasFeesTier[]).flatMap((tier) =>
      waitBuckets(TIER_WAIT_SECONDS[tier], 5_000_000).map((b) => ({
        ...b,
        tier,
      })),
    ) satisfies GasFeesTierWaitTotal[],
    hourlyTips: days.flatMap((day) =>
      Array.from({ length: 24 }, (_, hour): GasFeesTipHourlyRecord => {
        const timestamp = UnixTime(day + hour * UnixTime.HOUR)
        return {
          timestamp,
          blockNumber: 23_000_000 + (timestamp - from) / 12,
          slowTipGwei: jitter(TIERS.slow, 0.5, 'slow', timestamp),
          mediumTipGwei: jitter(TIERS.medium, 0.5, 'medium', timestamp),
          fastTipGwei: jitter(HOURLY_FAST, 0.5, 'fast', timestamp),
          ethUsd: ethUsd(timestamp),
        }
      }),
    ),
  }
}

function mockPayersDay(
  timestamp: UnixTime,
  ethUsd: number,
): GasFeesTipPayersDailyRecord {
  const group = (txs: number, gwei: number) => {
    const txCount = Math.round(jitter(txs, 0.2, txs, timestamp))
    return { txCount, tipEth: txCount * gwei * 120_000 * 1e-9 }
  }
  const low = group(800_000, 0.01)
  const middle = group(230_000, 0.35)
  const high = group(240_000, 1.15)
  return {
    timestamp,
    status: 'complete',
    ethUsd,
    fastTipGwei: HOURLY_FAST,
    low,
    middle,
    high,
    roundTipTxCount: Math.round(high.txCount * 0.6),
    atFastTipEth:
      low.tipEth +
      (middle.txCount + high.txCount) * HOURLY_FAST * 120_000 * 1e-9 * 0.55,
    nonOrdinary: group(150_000, 5),
  }
}

/** The page's tip levels: 30 a decade from 0.01 to 0.1 gwei, then every 0.05 gwei to 2.05 */
function mockLevelWaits(): GasFeesTipLevelWaitTotal[] {
  const bounds: number[] = []
  for (let k = 0; k < 30; k++) bounds.push(Math.round(1e7 * 10 ** (k / 30)))
  for (let k = 0; k <= 39; k++) bounds.push(1e8 + k * 5e7)
  return bounds.slice(0, -1).flatMap((tipFromWei, i) => {
    const tipToWei = bounds[i + 1] ?? tipFromWei
    const gwei = (tipFromWei + tipToWei) / 2e9
    const round = [1e8, 1e9, 2e9].includes(tipFromWei)
    const txCount = Math.round(
      jitter(
        (round ? 30 : 1) * 4e6 * gwei ** -0.7 * 0.05,
        0.6,
        'txs',
        tipFromWei,
      ),
    )
    const wait = 16 + 28 / (1 + 40 * gwei) + jitter(3, 1, 'wait', tipFromWei)
    return waitBuckets(wait, txCount).map((b) => ({
      ...b,
      tipFromWei,
      tipToWei,
      tipSumGwei: b.txCount * gwei,
    }))
  })
}

/** Buckets whose 99th percentile falls about `seconds` in */
function waitBuckets(seconds: number, txCount: number) {
  const bucket = (s: number, share: number) => {
    const waitFromMs = Math.floor((s * 1000) / 500) * 500
    return {
      waitFromMs,
      waitToMs: waitFromMs + 500,
      txCount: Math.round(txCount * share),
    }
  }
  return [
    bucket(2, 0.4),
    bucket(Math.min(12, seconds * 0.4), 0.4),
    bucket(seconds * 0.7, 0.185),
    bucket(seconds, 0.015),
  ]
}

const WALLETS: Record<GasFeesWallet, Record<GasFeesTier, number>> = {
  Ambire: { slow: 0.0011, medium: 0.05, fast: 0.18 },
  MetaMask: { slow: 0.0001, medium: 2, fast: 2 },
  Rabby: { slow: 0.15, medium: 0.6, fast: 1.5 },
}

export function getMockLiveTips(): GasFeesLiveTips {
  const now = UnixTime.now()
  return {
    estimate: {
      blockNumber: 24_000_000 + Math.floor(now / 12),
      tips: {
        slow: TIERS.slow,
        medium: jitter(TIERS.medium, 0.3, 'live', Math.floor(now / 12)),
        fast: jitter(TIERS.fast, 0.3, 'live-fast', Math.floor(now / 12)),
      },
      ethUsd: 3100,
      updatedAt: now - 2,
    },
    wallets: Object.entries(WALLETS).flatMap(([wallet, tiers]) =>
      (Object.entries(tiers) as [GasFeesTier, number][]).map(
        ([tier, tipGwei]) => ({
          wallet: wallet as GasFeesWallet,
          tier,
          tipGwei,
        }),
      ),
    ),
  }
}
