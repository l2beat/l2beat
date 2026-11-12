import { useMemo } from 'react'
import {
  formatCount,
  formatGasPerSecond,
  formatInteger,
  formatPercent,
  formatPerSecond,
} from '../format'
import { useEthereumHead } from '../live/EthereumHeadContext'
import { elapsedToday } from '../metrics'
import { useHistory } from '../state/history'
import { ChainTimeline } from '../timeline/ChainTimeline'
import { Legend } from '../timeline/Legend'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { Part, Section } from '../ui/Section'
import { Change, Fig, Story } from '../ui/Story'
import {
  blocksOf,
  changeOf,
  lastTwoWeeks,
  sumOf,
  txsOf,
  type Weeks,
} from '../weekly'
import { BlockPanel } from './BlockPanel'

const ACTIVITY_METRICS: Metric[] = [
  {
    id: 'tps',
    label: 'Transactions per second',
    pick: (p) => p.tps,
    today: (t) => (t.slots > 0 ? t.txs / elapsedToday(t) : undefined),
    format: formatPerSecond,
    kind: 'bucket',
  },
  {
    id: 'gas',
    label: 'Gas per second',
    pick: (p) => p.gasPerSecond,
    today: (t) => (t.slots > 0 ? t.gasUsed / elapsedToday(t) : undefined),
    format: formatGasPerSecond,
    kind: 'bucket',
  },
  {
    id: 'missed',
    label: 'Missed slots',
    pick: (p) => p.missedSlots,
    today: (t) => t.missed,
    format: formatInteger,
    kind: 'bucket',
    todayNote: 'Since 00:00 UTC: the day is not over, so it will end higher.',
  },
  {
    id: 'reorgs',
    label: 'Reorgs',
    pick: (p) => p.reorgs,
    format: formatInteger,
    kind: 'bucket',
  },
]

/**
 * The chain as it is now: the last 64 slots, one block close up, and how
 * block production has gone day by day. Every live number on the page is
 * here, once; the sections below tell the week.
 */
export function Now({ order }: { order: number }) {
  const history = useHistory()
  const weeks = useMemo(() => lastTwoWeeks(history), [history])
  return (
    <Section
      id="now"
      order={order}
      title="Right now"
      anchored
      story={<NowStory weeks={weeks} />}
      lede="A new slot every 12 seconds. Until a slot is finalized, about 13 minutes on, a reorg can still rewrite it. Drag along the chain to read an earlier block."
    >
      <div className="mb-3 flex justify-end">
        <Legend />
      </div>
      <ChainTimeline />
      <BlockPanel />
      <Part
        id="activity"
        title="Block production, day by day"
        className="mt-10"
      >
        <HistoryChart metrics={ACTIVITY_METRICS} />
      </Part>
    </Section>
  )
}

function NowStory({ weeks }: { weeks: Weeks | undefined }) {
  const { today } = useEthereumHead()
  if (!weeks) return null
  const { current, previous } = weeks
  const txs = sumOf(current, txsOf)
  const blocks = sumOf(current, blocksOf)
  const missed = sumOf(current, (p) => p.missedSlots)
  const reorgs = sumOf(current, (p) => p.reorgs)
  return (
    <Story weeks={weeks}>
      Ethereum produced <Fig>{formatInteger(blocks)} blocks</Fig> carrying{' '}
      <Fig>{formatCount(txs)} transactions</Fig>,{' '}
      <Change change={changeOf(txs, sumOf(previous, txsOf))} />. It missed{' '}
      <Fig>{formatPercent(missed / (blocks + missed))}</Fig> of its slots, and
      its head was reorged{' '}
      <Fig>{reorgs === 1 ? 'once' : `${reorgs} times`}</Fig>.{' '}
      <span className="text-secondary">
        Today so far: <Rolling value={today?.txs} format={formatInteger} />{' '}
        transactions in <Rolling value={today?.blocks} format={formatInteger} />{' '}
        blocks.
      </span>
    </Story>
  )
}
