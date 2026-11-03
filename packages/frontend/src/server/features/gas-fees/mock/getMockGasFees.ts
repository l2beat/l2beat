import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_CHAINS, type GasFeesChainId } from '../chains'
import { GAS_PER_ACTION, type GasFeesRecord } from '../types'

// Fake but plausible fees until a backend tracks them. Deterministic, so
// every request and every prefetch agrees. Shapes follow Ethereum's real
// history: 2021 peaks, EIP-1559, the Dencun drop for L2s, gas limit raises.

const START = UnixTime.fromDate(new Date('2020-01-01T00:00:00Z'))
const LONDON = date('2021-08-05')
const MERGE = date('2022-09-15')
const DENCUN = date('2024-03-13')

let cached: { until: number; data: Map<GasFeesChainId, GasFeesRecord[]> }

/** Daily records per chain, from 2020 (or launch) to the last full UTC day */
export function getMockGasFees(): Map<GasFeesChainId, GasFeesRecord[]> {
  const until = UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY
  if (cached?.until !== until) {
    cached = { until, data: generate(until) }
  }
  return cached.data
}

interface L2Params {
  launch: string
  /** Pre-Dencun L1 data cost per tx, as a share of an L1 transfer */
  dataFactor: number
  /** Post-Dencun L1 data cost per tx at ETH = $3000 */
  blobUsd: number
  /** L2 execution base fee per tx at ETH = $3000 */
  execUsd: number
  /** Share of fees that are tips, null when the chain has no priority fees */
  prioShare: number | null
  medianFactor: number
  tx: [string, number][]
}

const L2_PARAMS: Record<Exclude<GasFeesChainId, 'ethereum'>, L2Params> = {
  arbitrum: {
    launch: '2021-08-31',
    dataFactor: 0.07,
    blobUsd: 0.0009,
    execUsd: 0.006,
    prioShare: null,
    medianFactor: 0.5,
    tx: [
      ['2021-08-31', 40_000],
      ['2022-09-01', 400_000],
      ['2023-03-23', 1_400_000],
      ['2024-01-01', 1_100_000],
      ['2024-06-01', 2_200_000],
      ['2025-06-01', 2_600_000],
      ['2026-11-02', 3_100_000],
    ],
  },
  base: {
    launch: '2023-08-09',
    dataFactor: 0.05,
    blobUsd: 0.0006,
    execUsd: 0.004,
    prioShare: 0.62,
    medianFactor: 0.22,
    tx: [
      ['2023-08-09', 300_000],
      ['2024-03-15', 2_000_000],
      ['2024-09-01', 5_000_000],
      ['2025-06-01', 9_500_000],
      ['2026-11-02', 12_000_000],
    ],
  },
  optimism: {
    launch: '2021-12-16',
    dataFactor: 0.09,
    blobUsd: 0.0012,
    execUsd: 0.005,
    prioShare: 0.35,
    medianFactor: 0.35,
    tx: [
      ['2021-12-16', 60_000],
      ['2022-06-01', 250_000],
      ['2023-06-01', 450_000],
      ['2024-06-01', 700_000],
      ['2025-06-01', 1_100_000],
      ['2026-11-02', 900_000],
    ],
  },
  zksync2: {
    launch: '2023-03-24',
    dataFactor: 0.04,
    blobUsd: 0.0008,
    execUsd: 0.012,
    prioShare: null,
    medianFactor: 0.6,
    tx: [
      ['2023-03-24', 400_000],
      ['2023-12-15', 1_600_000],
      ['2024-06-15', 500_000],
      ['2025-06-01', 300_000],
      ['2026-11-02', 450_000],
    ],
  },
  linea: {
    launch: '2023-07-11',
    dataFactor: 0.05,
    blobUsd: 0.0011,
    execUsd: 0.007,
    prioShare: 0.12,
    medianFactor: 0.55,
    tx: [
      ['2023-07-11', 100_000],
      ['2024-03-01', 300_000],
      ['2024-09-01', 450_000],
      ['2025-09-01', 300_000],
      ['2026-11-02', 380_000],
    ],
  },
  scroll: {
    launch: '2023-10-17',
    dataFactor: 0.06,
    blobUsd: 0.0015,
    execUsd: 0.006,
    prioShare: 0.1,
    medianFactor: 0.55,
    tx: [
      ['2023-10-17', 50_000],
      ['2024-03-01', 250_000],
      ['2024-10-01', 400_000],
      ['2025-06-01', 150_000],
      ['2026-11-02', 120_000],
    ],
  },
  starknet: {
    launch: '2021-11-29',
    dataFactor: 0.03,
    blobUsd: 0.0005,
    execUsd: 0.009,
    prioShare: 0.06,
    medianFactor: 0.6,
    tx: [
      ['2021-11-29', 2_000],
      ['2022-12-01', 60_000],
      ['2023-11-01', 500_000],
      ['2024-04-01', 900_000],
      ['2025-06-01', 450_000],
      ['2026-11-02', 600_000],
    ],
  },
  unichain: {
    launch: '2025-02-11',
    dataFactor: 0.05,
    blobUsd: 0.0007,
    execUsd: 0.003,
    prioShare: 0.45,
    medianFactor: 0.3,
    tx: [
      ['2025-02-11', 300_000],
      ['2025-06-01', 1_400_000],
      ['2026-11-02', 2_000_000],
    ],
  },
}

const ethUsd = curve([
  ['2020-01-01', 130],
  ['2020-03-13', 110],
  ['2020-08-15', 430],
  ['2020-12-31', 735],
  ['2021-02-20', 1950],
  ['2021-05-11', 4150],
  ['2021-07-20', 1800],
  ['2021-11-09', 4800],
  ['2022-01-24', 2400],
  ['2022-03-29', 3400],
  ['2022-06-18', 1000],
  ['2022-08-13', 1950],
  ['2022-12-31', 1200],
  ['2023-04-15', 2100],
  ['2023-10-10', 1550],
  ['2023-12-31', 2300],
  ['2024-03-12', 4050],
  ['2024-08-05', 2300],
  ['2024-12-16', 4000],
  ['2025-04-08', 1450],
  ['2025-08-22', 4850],
  ['2025-11-20', 2800],
  ['2026-02-15', 3300],
  ['2026-06-01', 2600],
  ['2026-09-01', 3400],
  ['2026-11-02', 3150],
])
const ethGasPrice = curve([
  ['2020-01-01', 8],
  ['2020-05-01', 25],
  ['2020-08-15', 140],
  ['2020-09-17', 380],
  ['2020-10-15', 80],
  ['2020-12-15', 60],
  ['2021-01-15', 110],
  ['2021-02-23', 260],
  ['2021-04-01', 140],
  ['2021-05-12', 310],
  ['2021-06-20', 28],
  ['2021-08-01', 40],
  ['2021-09-15', 110],
  ['2021-11-10', 160],
  ['2022-01-15', 120],
  ['2022-03-01', 50],
  ['2022-05-01', 150],
  ['2022-05-20', 40],
  ['2022-07-01', 25],
  ['2022-09-15', 14],
  ['2022-11-10', 35],
  ['2022-12-15', 15],
  ['2023-02-01', 26],
  ['2023-05-05', 125],
  ['2023-06-15', 24],
  ['2023-09-01', 14],
  ['2023-12-15', 45],
  ['2024-03-05', 75],
  ['2024-03-20', 45],
  ['2024-05-01', 10],
  ['2024-07-01', 5],
  ['2024-09-01', 2.4],
  ['2024-12-10', 18],
  ['2025-01-15', 8],
  ['2025-03-01', 1.2],
  ['2025-05-15', 1.6],
  ['2025-08-15', 2.6],
  ['2025-10-10', 3.2],
  ['2025-11-01', 0.6],
  ['2025-12-15', 0.26],
  ['2026-03-01', 0.32],
  ['2026-06-01', 0.15],
  ['2026-09-01', 0.21],
  ['2026-11-02', 0.18],
])
// Average priority tip in gwei. Falls slower than the base fee, so its share
// grows as blocks get emptier.
const ethPriority = curve([
  ['2021-08-05', 2.2],
  ['2021-11-10', 3],
  ['2022-05-01', 4],
  ['2022-09-15', 1.4],
  ['2023-05-05', 3.5],
  ['2023-09-01', 0.9],
  ['2024-03-05', 1.8],
  ['2024-09-01', 0.45],
  ['2025-03-01', 0.22],
  ['2025-10-10', 0.5],
  ['2025-12-15', 0.09],
  ['2026-11-02', 0.07],
])
const ethTx = curve([
  ['2020-01-01', 720_000],
  ['2020-09-17', 1_250_000],
  ['2021-05-12', 1_500_000],
  ['2021-08-01', 1_200_000],
  ['2022-01-01', 1_150_000],
  ['2022-09-15', 1_050_000],
  ['2023-05-05', 1_150_000],
  ['2024-01-01', 1_150_000],
  ['2024-09-01', 1_100_000],
  ['2025-03-01', 1_350_000],
  ['2025-08-15', 1_750_000],
  ['2026-01-15', 2_000_000],
  ['2026-11-02', 2_250_000],
])
const execTrend = curve([
  ['2021-08-01', 3],
  ['2022-06-01', 1.6],
  ['2023-06-01', 1],
  ['2024-03-13', 1],
  ['2025-01-01', 0.7],
  ['2026-11-02', 0.45],
])
const GAS_LIMITS: [string, number][] = [
  ['2020-01-01', 10_000_000],
  ['2020-11-01', 12_500_000],
  ['2021-04-20', 15_000_000],
  ['2021-08-05', 30_000_000],
  ['2025-02-04', 36_000_000],
  ['2025-07-21', 45_000_000],
  ['2025-11-25', 60_000_000],
]

function generate(until: number): Map<GasFeesChainId, GasFeesRecord[]> {
  const days: number[] = []
  for (let t = START; t <= until; t += UnixTime.DAY) days.push(t)

  const nGas = noise(11, 0.13)
  const sGas = spikes(12, 0.012, 1.6, 3.5)
  const nPrio = noise(13, 0.18)
  const nTx = noise(14, 0.04, 0.7)
  const nUtil = noise(15, 0.05, 0.6)
  const nEth = noise(16, 0.02, 0.9)

  const ethPrices: number[] = []
  const ethTransferCost: number[] = []
  const ethereum = days.map((t): GasFeesRecord => {
    const price = ethUsd(t) * nEth()
    const gasPrice = ethGasPrice(t) * nGas() * sGas()
    const blocks = t < MERGE ? 6450 : 7150
    const util = Math.min(0.99, (t < LONDON ? 0.95 : 0.52) * nUtil())
    const gasUsed = gasLimitAt(t) * blocks * util
    const txCount = Math.round(ethTx(t) * nTx())
    const prio =
      t >= LONDON ? Math.min(ethPriority(t) * nPrio(), gasPrice * 0.85) : null
    const base = prio === null ? null : gasPrice - prio
    const usdPerGwei = 1e-9 * price
    const totalFees = gasUsed * gasPrice * usdPerGwei
    // A typical tx pays the base fee and a modest tip; the average is pulled
    // up by heavy contract calls and bots that overbid.
    const typicalGwei =
      base !== null && prio !== null ? base + prio * 0.45 : gasPrice * 0.8
    const perGas = typicalGwei * usdPerGwei
    ethPrices.push(price)
    ethTransferCost.push(GAS_PER_ACTION.transfer * gasPrice * usdPerGwei)
    return {
      timestamp: t,
      txCount,
      totalFees,
      baseFees: base === null ? null : gasUsed * base * usdPerGwei,
      priorityFees: prio === null ? null : gasUsed * prio * usdPerGwei,
      l1DataFees: 0,
      medianFee: (totalFees / txCount) * 0.42,
      transfer: GAS_PER_ACTION.transfer * perGas,
      erc20: GAS_PER_ACTION.erc20 * perGas,
      swap: GAS_PER_ACTION.swap * perGas,
      nftMint: GAS_PER_ACTION.nftMint * perGas,
    }
  })

  const result = new Map<GasFeesChainId, GasFeesRecord[]>([
    ['ethereum', ethereum],
  ])

  // Shared by every L2: blob fee market spikes
  const blobSpikes = spikes(99, 0.006, 3, 18)
  const blobMultipliers = days.map(() => blobSpikes())

  GAS_FEES_CHAINS.forEach((chain, i) => {
    if (chain.id === 'ethereum') return
    const p = L2_PARAMS[chain.id]
    const launch = date(p.launch)
    const txCurve = curve(p.tx)
    const nExec = noise(200 + i, 0.16)
    const sExec = spikes(300 + i, 0.01, 2, 6)
    const nTxL2 = noise(400 + i, 0.07, 0.75)
    const nData = noise(500 + i, 0.12)
    const nPrioL2 = noise(600 + i, 0.15)

    const records: GasFeesRecord[] = []
    days.forEach((t, di) => {
      // Advanced every day, so a chain's noise doesn't depend on its launch
      const exN = nExec()
      const exS = sExec()
      const txN = nTxL2()
      const dN = nData()
      const pN = nPrioL2()
      if (t < launch) return

      const ramp = Math.min(1, (t - launch) / (60 * UnixTime.DAY))
      const txCount = Math.round(txCurve(t) * txN * (0.3 + 0.7 * ramp))
      const ethScale = (ethPrices[di] ?? 3000) / 3000
      const dataUsd =
        t < DENCUN
          ? (ethTransferCost[di] ?? 0) * p.dataFactor * dN
          : p.blobUsd * ethScale * dN * (blobMultipliers[di] ?? 1)
      const execUsd = p.execUsd * execTrend(t) * Math.sqrt(ethScale) * exN * exS
      const prioUsd =
        p.prioShare === null
          ? 0
          : (execUsd + dataUsd) * (p.prioShare / (1 - p.prioShare)) * pN
      const avgFee = execUsd + dataUsd + prioUsd
      // Execution per gas for a ~120k gas average tx; small txs carry less data
      const perGas = execUsd / 120_000
      const action = (gas: number) =>
        gas * perGas * (p.prioShare ? 1.15 : 1) +
        dataUsd * (0.55 + gas / 400_000)

      records.push({
        timestamp: t,
        txCount,
        totalFees: avgFee * txCount,
        baseFees: execUsd * txCount,
        priorityFees: p.prioShare === null ? null : prioUsd * txCount,
        l1DataFees: dataUsd * txCount,
        medianFee: avgFee * p.medianFactor,
        transfer: action(GAS_PER_ACTION.transfer),
        erc20: action(GAS_PER_ACTION.erc20),
        swap: action(GAS_PER_ACTION.swap),
        nftMint: action(GAS_PER_ACTION.nftMint),
      })
    })
    result.set(chain.id, records)
  })

  return result
}

function gasLimitAt(t: number) {
  let limit = GAS_LIMITS[0]?.[1] ?? 0
  for (const [d, l] of GAS_LIMITS) if (date(d) <= t) limit = l
  return limit
}

function date(iso: string) {
  return UnixTime.fromDate(new Date(`${iso}T00:00:00Z`))
}

/** Log-space smoothstep interpolation between [date, value] keyframes */
function curve(keys: [string, number][]) {
  const k = keys.map(([d, v]) => [date(d), Math.log(v)] as const)
  return (t: number) => {
    const first = k[0]
    const last = k[k.length - 1]
    if (!first || !last) return 0
    if (t <= first[0]) return Math.exp(first[1])
    for (let i = 1; i < k.length; i++) {
      const a = k[i - 1]
      const b = k[i]
      if (a && b && t <= b[0]) {
        const f = (t - a[0]) / (b[0] - a[0])
        const s = f * f * (3 - 2 * f)
        return Math.exp(a[1] + (b[1] - a[1]) * s)
      }
    }
    return Math.exp(last[1])
  }
}

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Mean-reverting AR(1) noise in log space */
function noise(seed: number, sigma: number, phi = 0.85) {
  const r = rng(seed)
  let x = 0
  return () => {
    const u = Math.max(r(), 1e-9)
    x =
      phi * x +
      sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r())
    return Math.exp(x)
  }
}

/** Rare multiplicative spikes that decay over a few days */
function spikes(seed: number, p: number, min: number, max: number) {
  const r = rng(seed)
  let m = 1
  return () => {
    if (r() < p) m = Math.max(m, min + (max - min) * r())
    const out = m
    m = 1 + (m - 1) * 0.45
    return out
  }
}
