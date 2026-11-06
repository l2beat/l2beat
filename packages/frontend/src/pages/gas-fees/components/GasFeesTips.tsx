import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import type { GasFeesRecentChain } from '~/server/features/gas-fees/getGasFeesRecent'
import { formatGasPrice } from './metrics'

const PLOT_WIDTH = 160

/**
 * Seven powers of ten up to the highest base fee or tip in one gas token.
 * Chains priced in another token get a scale of their own, as wide, so their
 * prices don't stretch the ETH one; the hover names the unit.
 */
export function getTipDomain(chains: GasFeesRecentChain[], gasToken: string) {
  let max = 0
  for (const chain of chains) {
    if (chain.gasToken !== gasToken) continue
    const tip = chain.tip
    const values = tip
      ? [tip.baseFee, tip.p90]
      : [chain.gas.baseFee.at(-1) ?? 0]
    for (const value of values) {
      max = Math.max(max, value)
    }
  }
  const hi = max > 0 ? Math.ceil(Math.log10(max)) : 0
  return { lo: hi - 7, hi }
}

export type TipDomain = ReturnType<typeof getTipDomain>

function decades({ lo, hi }: TipDomain) {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
}

function toX(value: number, { lo, hi }: TipDomain) {
  const t = value > 0 ? (Math.log10(value) - lo) / (hi - lo) : 0
  return Math.min(1, Math.max(0, t)) * PLOT_WIDTH
}

/**
 * The last hour's base fee as a tick, and the tips like a box plot: a line
 * from the bottom to the top 10%, the middle half as a band, the median as
 * a dot
 */
export function TipPlot({
  chain,
  domain,
  role,
}: {
  chain: GasFeesRecentChain | undefined
  domain: TipDomain
  role: string
}) {
  if (!chain) return <TipRole role={role}>{EM_DASH}</TipRole>
  const { tip } = chain
  const baseFee = tip?.baseFee ?? chain.gas.baseFee.at(-1) ?? 0
  const x = (value: number) => toX(value, domain)
  return (
    <TipRole role={role}>
      <TipTooltip chain={chain} baseFee={baseFee}>
        <svg
          width={PLOT_WIDTH}
          height={14}
          className="overflow-visible"
          aria-hidden
        >
          <line
            x1={0}
            x2={PLOT_WIDTH}
            y1={7}
            y2={7}
            className="stroke-divider"
          />
          {/* A tick per power of ten, in place of axis labels */}
          {decades(domain).map((p) => (
            <line
              key={p}
              x1={x(10 ** p)}
              x2={x(10 ** p)}
              y1={4}
              y2={10}
              className="stroke-divider"
            />
          ))}
          {tip && (
            <>
              <line
                x1={x(tip.p10)}
                x2={x(tip.p90)}
                y1={7}
                y2={7}
                strokeWidth={1.5}
                className="stroke-chart-stacked-pink"
              />
              <rect
                x={x(tip.p25)}
                width={Math.max(4, x(tip.p75) - x(tip.p25))}
                y={3}
                height={8}
                rx={4}
                className="fill-chart-stacked-pink opacity-50"
              />
            </>
          )}
          <rect
            x={x(baseFee) - 1.5}
            width={3}
            y={-1}
            height={16}
            rx={1.5}
            className="fill-chart-stacked-blue"
          />
          {tip && (
            <circle
              cx={x(tip.median)}
              cy={7}
              r={4}
              className="fill-chart-pink stroke-[1.5] stroke-surface-primary"
            />
          )}
        </svg>
      </TipTooltip>
    </TipRole>
  )
}

function TipRole({
  role,
  children,
}: {
  role: string
  children: React.ReactNode
}) {
  return (
    <span className="flex flex-col gap-1">
      {children}
      <span className="text-2xs text-secondary">{role}</span>
    </span>
  )
}

function TipTooltip({
  chain,
  baseFee,
  children,
}: {
  chain: GasFeesRecentChain
  baseFee: number
  children: React.ReactNode
}) {
  const { tip, gasUnit, gasToken } = chain
  const rows: [string, number][] = [
    ['Base fee, last hour', baseFee],
    ...(tip
      ? ([
          ['Tip, top 10%', tip.p90],
          ['Tip, upper quartile', tip.p75],
          ['Tip, median', tip.median],
          ['Tip, lower quartile', tip.p25],
          ['Tip, bottom 10%', tip.p10],
        ] as [string, number][])
      : []),
  ]
  return (
    <Tooltip>
      <TooltipTrigger className="block py-1">{children}</TooltipTrigger>
      <TooltipContent className="flex w-64 flex-col gap-1.5 text-xs tabular-nums">
        {rows.map(([label, value]) => (
          <span key={label} className="flex justify-between gap-3">
            <span className="text-secondary">{label}</span>
            {formatGasPrice(value, gasUnit)}
            {gasToken !== 'ETH' && ` ${gasToken}`}
          </span>
        ))}
        <span className="text-2xs text-secondary">
          {tip && 'Spread of the 24 hourly average tips. '}
          {gasToken === 'ETH'
            ? 'Per gas, on a log scale shared by every chain priced in ETH.'
            : `Per gas in ${gasToken}, on a log scale of its own: positions don't compare with chains priced in ETH.`}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export function TipLegend() {
  return (
    <span className="flex items-center gap-3 text-2xs text-secondary">
      <span className="flex items-center gap-1">
        <span className="h-3 w-[3px] rounded-[1px] bg-chart-stacked-blue" />
        Base fee, last hour
      </span>
      <span className="flex items-center gap-1">
        <svg width={30} height={8} aria-hidden>
          <line
            x1={0}
            x2={30}
            y1={4}
            y2={4}
            strokeWidth={1.5}
            className="stroke-chart-stacked-pink"
          />
          <rect
            x={7}
            y={0}
            width={16}
            height={8}
            rx={4}
            className="fill-chart-stacked-pink opacity-50"
          />
          <circle cx={15} cy={4} r={3.5} className="fill-chart-pink" />
        </svg>
        Tips: 10–90%, middle half, median
      </span>
    </span>
  )
}
