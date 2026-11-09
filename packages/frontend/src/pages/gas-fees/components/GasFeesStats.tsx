import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, formatTimes, getPeriodLabel } from './metrics'

interface Props {
  stats: GasFeesSummary['stats'] | undefined
  range: ChartRange
  isLoading: boolean
}

const ETH = 'var(--chart-ethereum)'
const L2 = 'var(--chart-ethereum-secondary)'
const L1 = 'var(--chart-stacked-yellow)'

/**
 * The headline with its two bars top left, the transfer cost as a tall
 * column on the right, and the L1 fee and gas token figures under the
 * headline
 */
export function GasFeesStats({ stats, range, isLoading }: Props) {
  if (isLoading || !stats) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }
  const f = getFigures(stats, getPeriodLabel(range))
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px] lg:gap-0">
      <div className="flex flex-col gap-5 md:col-span-2 lg:pr-6 lg:pb-5">
        <Headline f={f} />
      </div>
      <div className="flex flex-col gap-2 border-divider max-lg:order-last max-lg:border-t max-lg:pt-5 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:border-l lg:pl-6">
        <TransferCost f={f} />
      </div>
      <div className="flex flex-col gap-2 border-divider border-t pt-5 lg:pr-6">
        <Label>L1 fee in L2 fees · {f.period}</Label>
        <Headed
          value={usd(f.l2s.l1DataFees)}
          note={`${percent(f.l1Share)} of L2 fees`}
        />
        <KeyedBar
          parts={[
            { label: 'L1 fee', value: f.l2s.l1DataFees, color: L1 },
            { label: 'L2 execution', value: f.execution, color: L2 },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2 border-divider border-t pt-5 md:border-l md:pl-6 lg:pr-6">
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
    l1Share: l2s.fees > 0 ? l2s.l1DataFees / l2s.fees : 0,
    execution: l2s.fees - l2s.l1DataFees,
    ethShare: l2s.fees > 0 ? ethFees / l2s.fees : 0,
    erc20: latestErc20,
    erc20Date: formatTimestamp(latestErc20.timestamp),
    timesCheaper:
      latestErc20.l2s > 0 ? latestErc20.ethereum / latestErc20.l2s : 0,
  }
}

function Headline({ f }: { f: Figures }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Ethereum vs L2s · {f.period}</Label>
        <p className="font-bold text-2xl leading-tight tracking-tight md:text-3xl">
          L2s process <Colored color={L2}>{percent(f.txShare)}</Colored> of
          transactions
          <br className="max-md:hidden" /> and earn{' '}
          <Colored color={ETH}>{percent(f.feeShare)}</Colored> of fees.
        </p>
      </div>
      <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 gap-y-3">
        <Label>Transactions</Label>
        <BigBar
          parts={[
            {
              value: f.l2s.txCount,
              color: L2,
              label: `L2s ${formatNumber(f.l2s.txCount, 1)}`,
            },
            {
              value: f.ethereum.txCount,
              color: ETH,
              label: `Ethereum ${formatNumber(f.ethereum.txCount, 1)}`,
            },
          ]}
        />
        <Label>Fees</Label>
        <div className="flex flex-col gap-1">
          <BigBar
            parts={[
              { value: f.l2s.fees, color: L2 },
              {
                value: f.ethereum.fees,
                color: ETH,
                label: `Ethereum ${usd(f.ethereum.fees)}`,
              },
            ]}
          />
          <span className="text-2xs text-secondary tabular-nums">
            ↑ L2s {usd(f.l2s.fees)}
          </span>
        </div>
      </div>
    </>
  )
}

/** The two costs as columns to scale, the gap between them as the headline */
function TransferCost({ f }: { f: Figures }) {
  const max = Math.max(f.erc20.ethereum, f.erc20.l2s)
  const columns = [
    { label: 'Ethereum', value: f.erc20.ethereum, color: ETH },
    { label: 'Median L2', value: f.erc20.l2s, color: L2 },
  ]
  return (
    <>
      <Label>ERC-20 transfer · {f.erc20Date}</Label>
      <span className="flex items-baseline gap-2">
        <span className="font-bold text-4xl tabular-nums tracking-tight">
          {formatTimes(f.timesCheaper)}
        </span>
        <span className="text-secondary text-xs">cheaper on L2s</span>
      </span>
      <div className="flex min-h-40 flex-1 items-end gap-4 pt-4">
        {columns.map((column) => (
          <div
            key={column.label}
            className="flex h-full flex-1 flex-col justify-end gap-1.5"
          >
            <span className="font-bold text-base tabular-nums">
              {formatFee(column.value)}
            </span>
            <span
              className="w-full rounded-t-lg"
              style={{
                height: `${Math.max(3, (column.value / max) * 100)}%`,
                backgroundColor: column.color,
              }}
            />
            <span className="text-secondary text-xs">{column.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-semibold text-2xs text-secondary uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </span>
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
      <span className="font-bold text-2xl tabular-nums tracking-tight">
        {value}
      </span>
      {note && <span className="text-secondary text-xs">{note}</span>}
    </span>
  )
}

/** Parts of a whole, labelled inside when they fit */
export function BigBar({
  parts,
}: {
  parts: { value: number; color: string; label?: string }[]
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className="flex h-11 gap-[3px] overflow-hidden rounded-lg font-semibold text-sm text-white">
      {parts.map((p, i) => {
        const share = total > 0 ? p.value / total : 0
        return (
          <span
            key={i}
            className="flex items-center overflow-hidden whitespace-nowrap px-3"
            style={{
              width: `${share * 100}%`,
              backgroundColor: p.color,
              paddingInline: share < 0.08 ? 0 : undefined,
            }}
          >
            {share >= 0.08 && p.label}
          </span>
        )
      })}
    </div>
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
      <div className="flex justify-between gap-3 text-xs">
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

function usd(value: number) {
  return formatCurrency(value, 'usd', { decimals: 1 })
}

function percent(share: number) {
  return `${share >= 0.1 || share === 0 ? Math.round(share * 100) : (share * 100).toFixed(1)}%`
}
