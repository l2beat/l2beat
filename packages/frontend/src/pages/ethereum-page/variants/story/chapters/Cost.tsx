import { useMemo } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { HeadBlock } from '../../../live/types'
import {
  Chapter,
  Figure,
  Para,
  Ref,
  Sidenote,
  Strong,
  ValueSlot,
} from '../Article'
import { between, gweiToEth, mean, type WindowStats } from '../facts'
import { formatGwei, formatPercentage, formatUsd } from '../format'
import { PriceList } from '../PriceList'
import type { ChartSeries } from '../StoryChart'
import { StoryChart } from '../StoryChart'
import type { TodayPoint } from '../today'
import { withToday } from './Capacity'

const TRANSFER_GAS = 21_000
const YEAR_2024 = Date.UTC(2024, 0, 1) / 1000
const YEAR_2025 = Date.UTC(2025, 0, 1) / 1000
const DENCUN = UPGRADES[0]?.timestamp ?? 0

/**
 * Chapter 2: what it costs. The claim compares the head block's base fee
 * with 2024's daily medians, both without tips, so like is weighed with like;
 * the price list adds the median tip, since that is what a sender pays.
 */
export function Cost({
  history,
  block,
  window,
  today,
  from,
  to,
}: {
  history: DailyPoint[]
  block: HeadBlock | undefined
  window: WindowStats | undefined
  today: TodayPoint | undefined
  from: number
  to: number
}) {
  const facts = useMemo(() => {
    const sinceDencun = history.filter((p) => p.timestamp >= DENCUN)
    return {
      average2024: mean(
        between(history, YEAR_2024, YEAR_2025),
        (p) => p.transferCostUsd,
      ),
      floorShare:
        sinceDencun.filter((p) => p.medianBlobFeeWei <= 1).length /
        Math.max(1, sinceDencun.length),
    }
  }, [history])
  const series = useMemo<ChartSeries[]>(
    () => [
      {
        id: 'transfer',
        label: 'ETH transfer',
        tone: 'ethereum',
        points: history.map((p) => ({ t: p.timestamp, v: p.transferCostUsd })),
      },
    ],
    [history],
  )

  const proposed = block?.status === 'proposed' ? block : undefined
  const transferNow = proposed
    ? gweiToEth(proposed.baseFeeGwei * TRANSFER_GAS) * proposed.ethPriceUsd
    : undefined
  const change =
    transferNow !== undefined ? 1 - transferNow / facts.average2024 : undefined
  const todayTransfer =
    today && window
      ? gweiToEth(window.medianBaseFeeGwei * TRANSFER_GAS) * window.ethPriceUsd
      : undefined

  return (
    <Chapter
      id="cost"
      order={2}
      claim={
        <>
          Sending ETH costs{' '}
          {transferNow !== undefined ? (
            <RollingNumber value={transferNow} format={formatUsd} />
          ) : (
            <ValueSlot chars={5} />
          )}{' '}
          right now,{' '}
          {change !== undefined ? (
            <>
              <RollingNumber
                value={Math.abs(change)}
                format={formatPercentage}
              />{' '}
              {change >= 0 ? 'less' : 'more'}
            </>
          ) : (
            <ValueSlot chars={8} />
          )}{' '}
          than in 2024
        </>
      }
      standfirst={
        <>
          Every block sets its own price. The base fee, now{' '}
          {proposed ? (
            <RollingNumber
              value={proposed.baseFeeGwei}
              format={formatGwei}
              className="font-semibold text-primary"
            />
          ) : (
            <ValueSlot chars={6} />
          )}{' '}
          per unit of gas, rises when blocks run over target and falls when they
          don't. It is burned, not paid to anyone.
          <Ref id="eip1559" />
        </>
      }
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,37rem)_15rem] lg:gap-x-14">
        <PriceList
          prices={
            proposed && window
              ? {
                  gasPriceGwei:
                    proposed.baseFeeGwei + window.medianPriorityFeeGwei,
                  blobBaseFeeWei: proposed.blobBaseFeeWei,
                  ethPriceUsd: proposed.ethPriceUsd,
                }
              : undefined
          }
        />
        <Sidenote>
          Prices use this block's base fee plus the median tip of the last few
          minutes, and typical gas for each action. A token or a route can use
          more.
          <Ref id="gas" />
        </Sidenote>
      </div>

      <Para
        className="mt-10"
        note={
          <>
            The 2024 figure is the average of that year's daily median transfer
            cost, at the base fee alone. The same measure is used for right now.
          </>
        }
      >
        Rollup data is priced in a market of its own, so a busy day for swaps
        doesn't raise the price of a blob. Since Dencun, the median blob fee was
        1 wei on <Strong>{formatPercentage(facts.floorShare)}</Strong> of days,
        the sign of a market with more space than demand. Sending ETH got
        cheaper over the same years, as the chart shows.
      </Para>

      <Figure caption="What an ETH transfer cost at each day's median base fee, in dollars, on a log scale: each gridline is ten times the one below.">
        <StoryChart
          series={withToday(
            series,
            today && todayTransfer !== undefined
              ? { t: today.t, v: todayTransfer }
              : undefined,
          )}
          from={from}
          to={to}
          scale="log"
          format={formatUsd}
          upgrades={UPGRADES}
          label="Cost of an ETH transfer in dollars since 2023, log scale"
        />
      </Figure>
    </Chapter>
  )
}
