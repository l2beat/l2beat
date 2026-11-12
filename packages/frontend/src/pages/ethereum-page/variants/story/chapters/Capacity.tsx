import { useMemo } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { cn } from '~/utils/cn'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import { Chapter, Figure, Para, Ref, Strong, TYPE, ValueSlot } from '../Article'
import { BlobStrip } from '../BlobStrip'
import {
  BLOB_BYTES,
  between,
  DAY_SECONDS,
  mean,
  SLOT_SECONDS,
  type WindowStats,
} from '../facts'
import {
  formatBytesPerSecond,
  formatInteger,
  formatMultiple,
  formatPercentage,
  formatRate,
} from '../format'
import type { ChartPoint, ChartSeries } from '../StoryChart'
import { StoryChart } from '../StoryChart'
import type { TodayPoint } from '../today'

const DENCUN = UPGRADES[0]?.timestamp ?? 0

/**
 * Chapter 1: what Ethereum carries. Data first, the job rollups hire it for,
 * then execution. Both claims compare complete periods only; the live numbers
 * sit in the sentences under them.
 */
export function Capacity({
  history,
  head,
  window,
  today,
  posters,
  from,
  to,
  storageSeconds,
}: {
  history: DailyPoint[]
  head: EthereumHead
  window: WindowStats | undefined
  today: TodayPoint | undefined
  posters: Map<string, BlobPoster>
  from: number
  to: number
  storageSeconds: number
}) {
  const facts = useMemo(() => {
    const last30 = history.slice(-30)
    const firstMonth = between(history, DENCUN, DENCUN + 30 * DAY_SECONDS)
    const before = between(history, DENCUN - 30 * DAY_SECONDS, DENCUN)
    return {
      ratio:
        mean(last30, (p) => p.dataPerSecond) /
        mean(firstMonth, (p) => p.dataPerSecond),
      dataNow: mean(last30, (p) => p.dataPerSecond),
      tpsNow: mean(last30, (p) => p.tps),
      tpsBefore: mean(before, (p) => p.tps),
    }
  }, [history])

  const dataSeries = useMemo<ChartSeries[]>(
    () => [
      {
        id: 'data',
        label: 'Blob data',
        tone: 'ethereum',
        points: history.map((p) => ({
          t: p.timestamp,
          v: p.dataPerSecond / 1024,
        })),
      },
      {
        id: 'target',
        label: 'Target',
        tone: 'reference',
        step: true,
        points: history.map((p) => ({
          t: p.timestamp,
          v: (targetAt(p.timestamp) * BLOB_BYTES) / SLOT_SECONDS / 1024,
        })),
      },
    ],
    [history],
  )
  const tpsSeries = useMemo<ChartSeries[]>(
    () => [
      {
        id: 'tps',
        label: 'Transactions per second',
        tone: 'ethereum',
        points: history.map((p) => ({ t: p.timestamp, v: p.tps })),
      },
    ],
    [history],
  )

  const targetBytes = (head.limits.targetBlobs * BLOB_BYTES) / SLOT_SECONDS
  const windowBytes = window
    ? (window.blobs * BLOB_BYTES) / window.seconds
    : undefined
  const minutes = window ? Math.round(window.seconds / 60) : 13

  return (
    <Chapter
      id="throughput"
      order={1}
      claim={
        <>
          Ethereum now carries {formatMultiple(facts.ratio)} the rollup data it
          did the month blobs arrived
        </>
      }
      standfirst={
        <>
          Over the last {minutes} minutes it took in{' '}
          {windowBytes !== undefined ? (
            <RollingNumber
              value={windowBytes}
              format={formatBytesPerSecond}
              className="font-semibold text-primary"
            />
          ) : (
            <ValueSlot chars={8} />
          )}{' '}
          of blobs, or{' '}
          {windowBytes !== undefined ? (
            <RollingNumber
              value={windowBytes / targetBytes}
              format={formatPercentage}
              className="font-semibold text-primary"
            />
          ) : (
            <ValueSlot chars={3} />
          )}{' '}
          of the target it is built to carry.
        </>
      }
    >
      <Para
        note={
          <>
            A <Strong>blob</Strong> is 128 KiB of data a rollup posts so anyone
            can rebuild its state. Nodes keep blobs for{' '}
            {Math.round(storageSeconds / DAY_SECONDS)} days, then drop them.
            <Ref id="eip4844" />
          </>
        }
      >
        Rollups post their transactions to Ethereum as blobs, so that anyone can
        check them. Since Dencun introduced blobs in March 2024, three upgrades
        have raised how many fit in a block: Pectra doubled the target
        <Ref id="eip7691" />, and Fusaka added sampling, which lets later forks
        raise the limits again
        <Ref id="eip7594" />
        <Ref id="eip7892" />. The last 30 complete days averaged{' '}
        <Strong>{formatBytesPerSecond(facts.dataNow)}</Strong>.
      </Para>

      <Figure
        caption={
          <>
            Blob data per second, daily average, against the target capacity.
            The hollow mark is today so far
            {today ? `, ${today.hoursIn} hours in` : ''}; it moves with every
            block and is left out of every comparison.
          </>
        }
      >
        <StoryChart
          series={withToday(
            dataSeries,
            today && { t: today.t, v: today.blobBytesPerSecond / 1024 },
          )}
          from={from}
          to={to}
          format={(v) => `${formatRate(v)} KiB/s`}
          upgrades={UPGRADES}
          label="Blob data per second since 2023, with the target capacity raised at each upgrade"
        />
      </Figure>

      <div className="my-10 md:my-12">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className={TYPE.label}>
            The last {head.blocks.length || 64} slots, one column each, coloured
            by who posted
          </h3>
          <a
            href="/blobs"
            className="font-medium text-[13px] text-link hover:underline"
          >
            Watch every blob land on the Blobs page
          </a>
        </div>
        <BlobStrip head={head} posters={posters} />
      </div>

      <section id="activity" className="scroll-mt-16 pt-4">
        <h3 className={cn(TYPE.claim, 'text-[21px] md:text-[26px]')}>
          Blocks run{' '}
          {window ? (
            <RollingNumber value={window.fullness} format={formatPercentage} />
          ) : (
            <ValueSlot chars={3} />
          )}{' '}
          full, settling{' '}
          {window ? (
            <RollingNumber
              value={window.txs / window.seconds}
              format={formatRate}
            />
          ) : (
            <ValueSlot chars={3} />
          )}{' '}
          transactions a second
        </h3>
        <Para
          className="mt-5"
          note={
            <>
              <Strong>Gas</Strong> measures computation. Each block has a gas
              limit of {formatInteger(head.limits.gasLimit / 1e6)}M and a target
              of half that; the base fee steers usage toward the target.
              <Ref id="gas" />
            </>
          }
        >
          Execution is the other half of the job: transfers, swaps and the
          rollups' own contracts. The last 30 complete days averaged{' '}
          <Strong>{formatRate(facts.tpsNow)}</Strong> transactions a second,
          against {formatRate(facts.tpsBefore)} the month before Dencun.{' '}
          {window && (
            <>
              Right now blocks process{' '}
              <Strong>
                <RollingNumber
                  value={window.gasUsed / window.seconds / 1e6}
                  format={formatRate}
                />
                M gas
              </Strong>{' '}
              and{' '}
              <Strong>
                <RollingNumber
                  value={window.uops / window.seconds}
                  format={formatRate}
                />
              </Strong>{' '}
              user operations a second.
            </>
          )}
        </Para>
        <Figure caption="Transactions per second, daily average.">
          <StoryChart
            series={withToday(tpsSeries, today && { t: today.t, v: today.tps })}
            from={from}
            to={to}
            format={formatRate}
            upgrades={UPGRADES}
            label="Ethereum transactions per second since 2023"
          />
        </Figure>
      </section>
    </Chapter>
  )
}

export function withToday(
  series: ChartSeries[],
  today: ChartPoint | undefined,
) {
  if (!today) return series
  const [first, ...rest] = series
  return first ? [{ ...first, today }, ...rest] : series
}

const PECTRA = UPGRADES[1]?.timestamp ?? 0
const BPO2 = UPGRADES[3]?.timestamp ?? 0

function targetAt(timestamp: number) {
  if (timestamp < DENCUN) return 0
  if (timestamp < PECTRA) return 3
  if (timestamp < BPO2) return 6
  return 14
}
