import { Fragment } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectIconList } from '~/components/ProjectIconList'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, formatTimes, getPeriodLabel } from './metrics'
import { ETH, L2, Label, percent, SPLIT, usd } from './parts'
import { TxFeesBreakdown } from './TxFeesBreakdown'
import type { GasFeesChain } from './types'

interface Props {
  summary: GasFeesSummary | undefined
  range: ChartRange
  isLoading: boolean
}

/**
 * The headline over the transactions-to-fees split on the left, with the
 * transfer cost beside the headline and the gas token beside the split
 */
export function GasFeesStats({ summary, range, isLoading }: Props) {
  if (isLoading || !summary) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }
  const f = getFigures(summary.stats, getPeriodLabel(range))
  return (
    // Two rows on wide cards: the headline beside the transfer cost, then
    // the split beside the gas token, each pair starting level
    <div className={cn(SPLIT.grid, '@3xl:grid-rows-[auto_1fr]')}>
      <div className={cn(SPLIT.main, '@3xl:col-start-1 @3xl:row-start-1')}>
        <Headline f={f} />
      </div>
      <div
        className={cn(
          SPLIT.main,
          '@3xl:col-start-1 @3xl:row-start-2 @3xl:h-auto h-72 @3xl:min-h-52 @3xl:pt-6',
        )}
      >
        <TxFeesBreakdown
          split={{
            tx: { l2s: f.l2s.txCount, ethereum: f.ethereum.txCount },
            fees: { l2s: f.l2s.fees, ethereum: f.ethereum.fees },
          }}
        />
      </div>
      <div
        className={cn(
          SPLIT.side,
          SPLIT.sidePad,
          '@3xl:col-start-2 @3xl:row-start-1 flex flex-col gap-2 @3xl:pb-6',
        )}
      >
        <TransferCost f={f} />
      </div>
      <div
        className={cn(
          SPLIT.side,
          SPLIT.sidePad,
          '@3xl:col-start-2 @3xl:row-start-2',
        )}
      >
        <div className="flex flex-col gap-2 border-divider @3xl:border-t @3xl:pt-6">
          <Label>L2 fees paid in ETH · {f.period}</Label>
          <Headed value={percent(f.ethShare)} />
          <KeyedBar
            parts={f.l2s.feesByToken.map((t) => ({
              label: `${t.token} ${usd(t.fees)}`,
              value: t.fees,
              color: t.token === 'ETH' ? ETH : 'var(--chart-stacked-pink)',
            }))}
          />
        </div>
      </div>
    </div>
  )
}

type Figures = ReturnType<typeof getFigures>

function getFigures(stats: GasFeesSummary['stats'], period: string) {
  const { ethereum, l2s, latestErc20 } = stats
  const txCount = ethereum.txCount + l2s.txCount
  const fees = ethereum.fees + l2s.fees
  const ethFees = l2s.feesByToken.find((t) => t.token === 'ETH')?.fees ?? 0
  return {
    period,
    ethereum,
    l2s,
    txShare: txCount > 0 ? l2s.txCount / txCount : 0,
    feeShare: fees > 0 ? l2s.fees / fees : 0,
    ethShare: l2s.fees > 0 ? ethFees / l2s.fees : 0,
    avgFee: {
      ethereum: ethereum.txCount > 0 ? ethereum.fees / ethereum.txCount : 0,
      l2s: l2s.txCount > 0 ? l2s.fees / l2s.txCount : 0,
    },
    erc20: latestErc20,
    erc20Date: formatTimestamp(latestErc20.timestamp),
    timesCheaper:
      latestErc20.l2s > 0 ? latestErc20.ethereum / latestErc20.l2s : 0,
  }
}

function avgFeeRatio(f: Figures) {
  return f.avgFee.l2s > 0 ? f.avgFee.ethereum / f.avgFee.l2s : 0
}

function Headline({ f }: { f: Figures }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{f.period}</Label>
      <p className="font-bold text-xl leading-tight tracking-tight md:text-2xl">
        L2s process <Colored color={L2}>{percent(f.txShare)}</Colored> of
        transactions
        <br className="max-md:hidden" /> and collect{' '}
        <Colored color={ETH}>{percent(f.feeShare)}</Colored> of the total fees
        paid by users.
      </p>
      <p className="text-secondary text-sm">
        An L2 transaction pays {formatTimes(avgFeeRatio(f))} less on average, so
        Ethereum still collects most of the fees.
      </p>
    </div>
  )
}

/** The L2s the section compares, beside its title, with the full list behind "+N" */
export function GasFeesComparedL2s({
  chains,
  summary,
}: {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
}) {
  if (!summary) return <Skeleton className="h-5 w-24" />
  // Only the L2s with fees in the range count towards the totals
  const l2s = summary.rows
    .filter((row) => row.id !== 'ethereum')
    .map((row) => chains.find((c) => c.id === row.id))
    .filter((chain) => chain !== undefined)
  return (
    <ProjectIconList
      title="L2s compared with Ethereum"
      projects={l2s.map((chain) => ({
        id: chain.id,
        name: chain.name,
        iconUrl: chain.iconUrl,
        href: chain.href,
        description: chain.type,
      }))}
    />
  )
}

/** The two costs as bars to scale, the gap between them as the figure */
function TransferCost({ f }: { f: Figures }) {
  const max = Math.max(f.erc20.ethereum, f.erc20.l2s)
  const rows = [
    { label: 'Ethereum', value: f.erc20.ethereum, color: ETH },
    { label: 'Median L2', value: f.erc20.l2s, color: L2 },
  ]
  return (
    <>
      <Label>ERC-20 transfer · {f.erc20Date}</Label>
      <Headed value={formatTimes(f.timesCheaper)} note="cheaper on L2s" />
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1.5 text-xs">
        {rows.map((row) => (
          <Fragment key={row.label}>
            <span className="text-secondary">{row.label}</span>
            <span className="h-2.5">
              <span
                className="block h-full rounded-sm"
                style={{
                  width: `max(3px, ${(row.value / max) * 100}%)`,
                  backgroundColor: row.color,
                }}
              />
            </span>
            <span className="text-right font-medium tabular-nums">
              {formatFee(row.value)}
            </span>
          </Fragment>
        ))}
      </div>
    </>
  )
}

export function Colored({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
}) {
  return <span style={{ color }}>{children}</span>
}

export function Headed({ value, note }: { value: string; note?: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="whitespace-nowrap font-bold text-2xl tabular-nums tracking-tight">
        {value}
      </span>
      {note && <span className="text-secondary text-xs">{note}</span>}
    </span>
  )
}

/** Parts of a whole with a key under each end */
export function KeyedBar({
  parts,
}: {
  parts: { label: string; value: number; color: string }[]
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-4 gap-0.5 overflow-hidden rounded-md">
        {parts.map((p) => (
          <span
            key={p.label}
            style={{
              width: `${total > 0 ? (p.value / total) * 100 : 0}%`,
              backgroundColor: p.color,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5 text-xs">
        {parts.map((p) => (
          <span
            key={p.label}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <span
              className="size-2 rounded-xs"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-secondary">{p.label}</span>
            <span className="font-medium tabular-nums">
              {percent(total > 0 ? p.value / total : 0)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
