import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_CHAINS } from './chains'
import { getMockGasFees } from './mock/getMockGasFees'
import { getMetricValue, median, summarize } from './summarize'
import {
  GAS_FEES_USD_METRICS,
  type GasFeesRecord,
  type GasFeesUsdMetric,
} from './types'

export interface GasFeesUpgrade {
  id: string
  kind: 'upgrade' | 'gasLimit' | 'next'
  title: string
  summary: string
  url: string
  /** Day it activated, null when not scheduled yet */
  timestamp: number | null
  /**
   * The median L2, 30 days before vs after, only for upgrades made to cut L2
   * costs. Ethereum's own fees aren't compared: demand moves them as much as
   * an upgrade does, and a gas limit raise adds room rather than cutting fees.
   */
  l2Median: BeforeAfter | null
}

type BeforeAfter = Record<GasFeesUsdMetric, { before: number; after: number }>

const WINDOW_DAYS = 30

const UPGRADES: (Omit<GasFeesUpgrade, 'timestamp' | 'l2Median'> & {
  date: string | null
  compareL2s?: boolean
})[] = [
  {
    id: 'glamsterdam',
    kind: 'next',
    title: 'Glamsterdam',
    summary:
      'ePBS and block-level access lists, paving the way for much higher gas limits.',
    url: 'https://eips.ethereum.org/EIPS/eip-7773',
    date: null,
  },
  {
    id: 'fusaka',
    kind: 'upgrade',
    title: 'Fusaka',
    summary: 'PeerDAS: much more blob space for L2s.',
    url: 'https://eips.ethereum.org/EIPS/eip-7607',
    date: '2025-12-03',
  },
  {
    id: 'gas-limit-60m',
    kind: 'gasLimit',
    title: 'Gas limit 45M → 60M',
    summary: 'Validators signal a higher block gas limit.',
    url: 'https://pumpthegas.org',
    date: '2025-11-25',
  },
  {
    id: 'gas-limit-45m',
    kind: 'gasLimit',
    title: 'Gas limit 36M → 45M',
    summary: 'Validators signal a higher block gas limit.',
    url: 'https://pumpthegas.org',
    date: '2025-07-21',
  },
  {
    id: 'pectra',
    kind: 'upgrade',
    title: 'Pectra',
    summary: 'Twice the blob throughput and a calldata floor price.',
    url: 'https://eips.ethereum.org/EIPS/eip-7600',
    date: '2025-05-07',
  },
  {
    id: 'gas-limit-36m',
    kind: 'gasLimit',
    title: 'Gas limit 30M → 36M',
    summary: 'The first gas limit raise since London.',
    url: 'https://pumpthegas.org',
    date: '2025-02-04',
  },
  {
    id: 'dencun',
    kind: 'upgrade',
    title: 'Dencun',
    summary: 'Blobs (EIP-4844): L2s stop paying calldata prices.',
    url: 'https://eips.ethereum.org/EIPS/eip-4844',
    date: '2024-03-13',
    compareL2s: true,
  },
  {
    id: 'shapella',
    kind: 'upgrade',
    title: 'Shapella',
    summary: 'Staking withdrawals enabled.',
    url: 'https://eips.ethereum.org/EIPS/eip-4895',
    date: '2023-04-12',
  },
  {
    id: 'merge',
    kind: 'upgrade',
    title: 'The Merge',
    summary: 'Proof of stake and 12-second slots. Fees stayed where they were.',
    url: 'https://ethereum.org/roadmap/merge',
    date: '2022-09-15',
  },
  {
    id: 'london',
    kind: 'upgrade',
    title: 'London',
    summary:
      'EIP-1559: a burned base fee set by the protocol plus a tip set by users. Gas limit 15M → 30M.',
    url: 'https://eips.ethereum.org/EIPS/eip-1559',
    date: '2021-08-05',
  },
  {
    id: 'berlin',
    kind: 'upgrade',
    title: 'Berlin',
    summary: 'Access lists and repriced state access.',
    url: 'https://eips.ethereum.org/EIPS/eip-2929',
    date: '2021-04-15',
  },
]

/** Newest first, with the next scheduled upgrade on top */
export function getGasFeesUpgrades(): GasFeesUpgrade[] {
  // Fake data until fees are tracked: see getMockGasFees
  const data = getMockGasFees()
  const l2s = GAS_FEES_CHAINS.filter((c) => c.id !== 'ethereum').map(
    (c) => data.get(c.id) ?? [],
  )

  return UPGRADES.map(({ date, compareL2s, ...upgrade }) => {
    const timestamp =
      date === null ? null : UnixTime.fromDate(new Date(`${date}T00:00:00Z`))
    return {
      ...upgrade,
      timestamp,
      l2Median:
        timestamp !== null && compareL2s ? beforeAfter(l2s, timestamp) : null,
    }
  })
}

/** For a single series the value itself, for several their median */
function beforeAfter(
  series: GasFeesRecord[][],
  timestamp: number,
): BeforeAfter | null {
  const window = WINDOW_DAYS * UnixTime.DAY
  const before = series.flatMap((records) => {
    const totals = summarize(
      records.filter(
        (r) => r.timestamp >= timestamp - window && r.timestamp < timestamp,
      ),
    )
    return totals ? [totals] : []
  })
  const after = series.flatMap((records) => {
    const totals = summarize(
      records.filter(
        (r) => r.timestamp >= timestamp && r.timestamp < timestamp + window,
      ),
    )
    return totals ? [totals] : []
  })
  if (before.length === 0 || after.length === 0) return null

  const result = {} as BeforeAfter
  for (const metric of GAS_FEES_USD_METRICS) {
    result[metric] = {
      before: median(before.map((t) => getMetricValue(t, metric))) ?? 0,
      after: median(after.map((t) => getMetricValue(t, metric))) ?? 0,
    }
  }
  return result
}
