import { Skeleton } from '~/components/core/Skeleton'
import { ProjectIconList } from '~/components/ProjectIconList'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import type { ChartRange } from '~/utils/range/range'
import { GasFeesFlow } from './GasFeesFlow'
import {
  compareWithEthereum,
  formatFee,
  formatFeeTick,
  getPeriodLabel,
} from './metrics'
import {
  ACCENT,
  Colored,
  DataGaps,
  ETH,
  KeyItem,
  L2,
  Label,
  NoDataYet,
  percent,
  ShareBar,
  SPLIT,
  StoredUntil,
  usd,
} from './parts'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  range: ChartRange
  isLoading: boolean
}

/** Where transactions happen and who collects the fees, and what one costs on either side */
export function GasFeesStats({ chains, summary, range, isLoading }: Props) {
  const period = getPeriodLabel(range)
  const ready = !isLoading && summary !== undefined
  // The figures compare the two, so both need transactions in the period
  const f =
    ready && summary.stats.ethereum.txCount > 0 && summary.stats.l2s.txCount > 0
      ? getFigures(summary.stats)
      : undefined
  const transfer = f?.erc20 && compareWithEthereum(f.erc20.times)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2>
            <Label>
              Ethereum vs L2s{DOT_SEPARATOR}
              {period}
            </Label>
          </h2>
          <GasFeesComparedL2s chains={chains} summary={summary} />
        </div>
        {!ready && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        )}
        {ready && !f && <NoDataYet />}
        {f && (
          <p className="max-w-[920px] font-bold text-2xl leading-[1.15] tracking-tight md:text-3xl">
            L2s process <Figure>{percent(f.txShare)}</Figure> of transactions
            and collect <Figure>{percent(f.feeShare)}</Figure> of the fees.
            {transfer && (
              <>
                <br className="@max-5xl:hidden" /> A transfer there costs{' '}
                <Figure>{transfer.times}</Figure> {transfer.amount}.
              </>
            )}
          </p>
        )}
        <StoredUntil lastDay={summary?.lastDay} />
        <DataGaps summary={summary} chains={chains} />
      </div>
      {f && (
        <div className={cn(SPLIT.grid, 'border-divider border-t pt-6')}>
          {/* The flow fills what the tracks beside it leave, so the row is only as tall as they are */}
          <div className={cn(SPLIT.main, 'flex flex-col gap-5')}>
            <GasFeesFlow
              txShare={f.txShare}
              feeShare={f.feeShare}
              ethereum={f.ethereum}
              l2s={f.l2s}
              className="@3xl:h-auto h-[260px] @3xl:min-h-[230px] @3xl:flex-1"
            />
            <PaidIn f={f} />
          </div>
          <div className={cn(SPLIT.side, SPLIT.sidePad, '@container')}>
            <CostTracks f={f} period={period} />
          </div>
        </div>
      )}
    </>
  )
}

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <span className="tabular-nums">
      <Colored color={ACCENT}>{children}</Colored>
    </span>
  )
}

type Figures = ReturnType<typeof getFigures>

function getFigures(stats: GasFeesSummary['stats']) {
  const { ethereum, l2s, latestErc20 } = stats
  const txCount = ethereum.txCount + l2s.txCount
  const fees = ethereum.fees + l2s.fees
  const ethFees = l2s.feesByToken.find((t) => t.token === 'ETH')?.fees ?? 0
  const avgFee = {
    ethereum: ethereum.fees / ethereum.txCount,
    l2s: l2s.fees / l2s.txCount,
  }
  return {
    ethereum,
    l2s,
    txShare: l2s.txCount / txCount,
    feeShare: fees > 0 ? l2s.fees / fees : 0,
    ethShare: l2s.fees > 0 ? ethFees / l2s.fees : 0,
    avgFee: { ...avgFee, times: avgFee.ethereum / avgFee.l2s },
    erc20: latestErc20 && {
      ...latestErc20,
      times: latestErc20.ethereum / latestErc20.l2s,
    },
  }
}

/** The L2s the section compares, beside its title, with the full list behind "+N" */
function GasFeesComparedL2s({
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

/** The share of the L2s' fees paid in ETH, and the split by gas token as a bar */
function PaidIn({ f }: { f: Figures }) {
  const tokenColor = (token: string) =>
    token === 'ETH' ? ETH : 'var(--chart-stacked-pink)'
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="flex items-baseline gap-2 whitespace-nowrap">
        <Label>L2 fees paid in ETH</Label>
        <span className="font-bold text-base tabular-nums tracking-tight">
          {percent(f.ethShare)}
        </span>
      </span>
      <ShareBar
        className="h-2.5 min-w-24 flex-1 gap-[2px] rounded-full"
        parts={f.l2s.feesByToken.map((t) => ({
          key: t.token,
          value: t.fees,
          color: tokenColor(t.token),
        }))}
      />
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-2xs">
        {f.l2s.feesByToken.map((t) => (
          <KeyItem key={t.token} color={tokenColor(t.token)}>
            <span>
              {t.token} {usd(t.fees)}
            </span>
            <b className="tabular-nums">
              {percent(f.l2s.fees > 0 ? t.fees / f.l2s.fees : 0)}
            </b>
          </KeyItem>
        ))}
      </div>
    </div>
  )
}

interface CostRow {
  key: string
  name: string
  /** The day or the period the costs are of */
  when: string
  ethereum: number
  l2s: number
  l2Name: string
  times: number
}

/**
 * Ethereum's cost and the L2s' as dots on one log scale, a row per measure,
 * with the gap between them shaded and its multiple as the row's figure
 */
function CostTracks({ f, period }: { f: Figures; period: string }) {
  const rows: CostRow[] = [
    ...(f.erc20
      ? [
          {
            key: 'erc20',
            name: 'ERC-20 transfer',
            when: formatTimestamp(f.erc20.timestamp),
            ethereum: f.erc20.ethereum,
            l2s: f.erc20.l2s,
            l2Name: 'Median L2',
            times: f.erc20.times,
          },
        ]
      : []),
    {
      key: 'avgFee',
      name: 'Average transaction',
      when: period,
      ethereum: f.avgFee.ethereum,
      l2s: f.avgFee.l2s,
      l2Name: 'L2s',
      times: f.avgFee.times,
    },
    // A log scale has no place for a cost of zero
  ].filter((row) => row.ethereum > 0 && row.l2s > 0)
  if (rows.length === 0) return <NoDataYet />

  const logs = rows.flatMap((row) => [row.ethereum, row.l2s]).map(Math.log10)
  const lo = Math.floor(Math.min(...logs))
  const hi = Math.max(lo + 1, Math.ceil(Math.max(...logs)))
  const decades = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
  const toX = (value: number) => ((Math.log10(value) - lo) / (hi - lo)) * 100

  return (
    <div className="grid @xl:grid-cols-[180px_minmax(0,1fr)] grid-cols-1">
      {rows.map((row) => {
        const compared = compareWithEthereum(row.times)
        return (
          <div
            key={row.key}
            className="col-span-full grid grid-cols-subgrid items-center gap-y-1 border-divider border-b py-3 first:pt-0"
          >
            <div className="flex @xl:flex-col items-baseline gap-x-3 @xl:gap-y-0.5">
              <span className="flex flex-col">
                <span className="font-bold text-base leading-tight">
                  {row.name}
                </span>
                <span className="text-2xs text-secondary">{row.when}</span>
              </span>
              {compared && (
                <span className="@xl:ml-0 ml-auto flex items-baseline gap-1.5">
                  <span
                    className="font-bold text-2xl tabular-nums tracking-tight"
                    style={{ color: ACCENT }}
                  >
                    {compared.times}
                  </span>
                  <span className="text-secondary text-xs">
                    {compared.amount} on L2s
                  </span>
                </span>
              )}
            </div>
            <div className="relative h-[60px]">
              {decades.map((power) => (
                <span
                  key={power}
                  className="absolute inset-y-0 border-divider border-l border-dashed opacity-70"
                  style={{ left: `${toX(10 ** power)}%` }}
                />
              ))}
              <span className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px] rounded-full bg-surface-tertiary opacity-60" />
              <Gap l2s={toX(row.l2s)} ethereum={toX(row.ethereum)} />
              <Dot
                x={toX(row.l2s)}
                value={row.l2s}
                name={row.l2Name}
                color={L2}
              />
              <Dot
                x={toX(row.ethereum)}
                value={row.ethereum}
                name="Ethereum"
                color={ETH}
              />
            </div>
          </div>
        )
      })}
      <div className="col-span-full grid grid-cols-subgrid pt-1.5 text-2xs text-secondary">
        <span className="max-@xl:hidden">USD, log scale</span>
        <div className="relative h-4">
          {decades.map((power) => (
            <span
              key={power}
              className={cn(
                'absolute tabular-nums',
                power === lo
                  ? 'left-0'
                  : power === hi
                    ? 'right-0'
                    : '-translate-x-1/2',
              )}
              style={
                power === lo || power === hi
                  ? undefined
                  : { left: `${toX(10 ** power)}%` }
              }
            >
              {formatFeeTick(10 ** power)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** The stretch between the two costs, fading from the L2s' colour into Ethereum's */
function Gap({ l2s, ethereum }: { l2s: number; ethereum: number }) {
  return (
    <span
      className="-translate-y-1/2 absolute top-1/2 h-2.5 rounded-full"
      style={{
        left: `${Math.min(l2s, ethereum)}%`,
        width: `${Math.abs(ethereum - l2s)}%`,
        background: `linear-gradient(${l2s <= ethereum ? 90 : 270}deg, color-mix(in oklab, ${L2} 55%, transparent), color-mix(in oklab, ${ETH} 75%, transparent))`,
      }}
    />
  )
}

/** A dot on the track, its cost above it and its name under it */
function Dot({
  x,
  value,
  name,
  color,
}: {
  x: number
  value: number
  name: string
  color: string
}) {
  // Kept inside the track at either end
  const align = x < 6 ? 'left-0' : x > 94 ? 'right-0' : '-translate-x-1/2'
  const anchor = x < 6 || x > 94 ? undefined : { left: `${x}%` }
  return (
    <>
      <span
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-3.5 rounded-full ring-3 ring-surface-primary"
        style={{ left: `${x}%`, background: color }}
      />
      <span
        className={cn(
          'absolute top-0 whitespace-nowrap font-bold text-sm tabular-nums',
          align,
        )}
        style={anchor}
      >
        {formatFee(value)}
      </span>
      <span
        className={cn(
          'absolute bottom-0 whitespace-nowrap text-2xs text-secondary',
          align,
        )}
        style={anchor}
      >
        {name}
      </span>
    </>
  )
}
