/**
 * Daily history the page's charts end on, until the head indexer rolls blocks
 * up into it. Seeded, so the server and the browser draw the same chart.
 * Each day is complete: today's partial day comes from `EthereumHead.today`.
 */

export interface DailyPoint {
  /** Unix seconds, 00:00 UTC */
  timestamp: number
  blobs: number
  /** Bytes per second averaged over the day */
  dataPerSecond: number
  avgBlobsPerBlock: number
  tps: number
  uops: number
  gasPerSecond: number
  medianBaseFeeGwei: number
  medianBlobFeeWei: number
  /** USD cost of a plain ETH transfer at the median base fee */
  transferCostUsd: number
  burnedEth: number
  issuedEth: number
  supplyEth: number
  stakedEth: number
  ethPriceUsd: number
  missedSlots: number
}

export interface Upgrade {
  name: string
  timestamp: number
  /** What changed, in a line */
  summary: string
}

export const UPGRADES: Upgrade[] = [
  {
    name: 'Dencun',
    timestamp: Date.UTC(2024, 2, 13) / 1000,
    summary: 'Blobs arrive: 3 target, 6 max per block',
  },
  {
    name: 'Pectra',
    timestamp: Date.UTC(2025, 4, 7) / 1000,
    summary: 'Blob target doubled to 6, max 9',
  },
  {
    name: 'Fusaka',
    timestamp: Date.UTC(2025, 11, 3) / 1000,
    summary: 'PeerDAS, then blob-parameter-only forks raise capacity',
  },
  {
    name: 'BPO2',
    timestamp: Date.UTC(2026, 0, 7) / 1000,
    summary: 'Blob target 14, max 21',
  },
]

const DAY = 86_400

export function getSimulatedHistory(
  endDay: number,
  days = 3 * 365,
): DailyPoint[] {
  const random = seeded(42)
  const points: DailyPoint[] = []
  let supply = 120_180_000
  let staked = 33_400_000
  for (let i = days; i >= 1; i--) {
    const timestamp = endDay - i * DAY
    const target = blobTargetAt(timestamp)
    const noise = () => 1 + (random() - 0.5) * 0.18
    const growth = 1 - i / days
    const avgBlobsPerBlock =
      target === 0
        ? 0
        : Math.min(target * 1.4, target * (0.55 + growth * 0.4) * noise())
    const missedSlots = Math.round(40 + random() * 60)
    const blocks = 7200 - missedSlots
    const blobs = Math.round(avgBlobsPerBlock * blocks)
    const tps = (12 + growth * 13) * noise()
    const medianBaseFeeGwei = Math.max(
      0.15,
      (target === 0 ? 18 : target <= 6 ? 6 : 0.9) *
        (1.2 - growth * 0.5) *
        noise() ** 3,
    )
    const ethPriceUsd =
      2600 + Math.sin(i / 60) * 700 + growth * 600 + random() * 80
    const gasPerSecond = (1.2e6 + growth * 1.9e6) * noise()
    const burnedEth = (medianBaseFeeGwei * gasPerSecond * DAY) / 1e9
    const issuedEth = 2650 + random() * 80
    supply += issuedEth - burnedEth
    staked += (random() - 0.35) * 4200
    points.push({
      timestamp,
      blobs,
      dataPerSecond: (blobs * 131072) / DAY,
      avgBlobsPerBlock,
      tps,
      uops: tps * 1.08,
      gasPerSecond,
      medianBaseFeeGwei,
      medianBlobFeeWei: avgBlobsPerBlock > target ? 1 + random() * 1e6 : 1,
      transferCostUsd: (medianBaseFeeGwei * 21_000 * ethPriceUsd) / 1e9,
      burnedEth,
      issuedEth,
      supplyEth: supply,
      stakedEth: staked,
      ethPriceUsd,
      missedSlots,
    })
  }
  return points
}

/** Unix seconds of 00:00 UTC today */
export function todayStart(now = Date.now()) {
  return Math.floor(now / 1000 / DAY) * DAY
}

const DENCUN = Date.UTC(2024, 2, 13) / 1000
const PECTRA = Date.UTC(2025, 4, 7) / 1000
const BPO2 = Date.UTC(2026, 0, 7) / 1000

function blobTargetAt(timestamp: number) {
  if (timestamp < DENCUN) return 0
  if (timestamp < PECTRA) return 3
  if (timestamp < BPO2) return 6
  return 14
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}
