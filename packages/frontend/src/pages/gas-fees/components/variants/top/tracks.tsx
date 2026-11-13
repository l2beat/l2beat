import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'
import { formatFee } from '../../metrics'
import {
  BANDS,
  Gwei,
  gwei,
  multiple,
  OURS,
  OVER,
  type TierRow,
  useWidth,
  WALLETS,
  WalletIcon,
} from './shared'

/**
 * B's log scale tracks: each tip, ours and the wallets', has a chip with its
 * gwei above or below the line, next to its dot
 */

/** Seven powers of ten, from a millionth of a gwei to 10 */
export const LO = -6
export const HI = 1
export const DECADES = Array.from({ length: HI - LO + 1 }, (_, i) => LO + i)
export const toX = (value: number) =>
  Math.min(1, Math.max(0, (Math.log10(value) - LO) / (HI - LO))) * 100

/** Where each band starts and ends on the track, in percent */
export const BAND_SPANS = BANDS.map((band, i) => {
  const from = i === 0 ? 0 : toX(BANDS[i - 1]?.max ?? 0)
  const to = i === BANDS.length - 1 ? 100 : toX(band.max)
  return { ...band, from, to }
})

const CHIP_GAP = 4

interface Placed {
  name: string
  icon: string
  option: string | undefined
  gwei: number
  multiple: number | undefined
  usd: number | undefined
  lane: number
  center: number
  x: number
  /** Our estimated tip, which gets its own chip in ink */
  ours?: boolean
}

/**
 * From the right, where the wallets crowd against the edge: each chip takes
 * the lane, above or below the line, that moves it least without overlapping
 * the chip after it
 */
function place(
  row: TierRow,
  width: number,
  chipWidth: (w: { gwei: number; ours?: boolean }) => number,
): Placed[] {
  const usdPerGwei =
    row.usd !== undefined && row.gwei ? row.usd / row.gwei : undefined
  const wallets = row.wallets.flatMap((w) =>
    w.gwei !== undefined
      ? [
          {
            ...w,
            gwei: w.gwei,
            usd: usdPerGwei === undefined ? undefined : w.gwei * usdPerGwei,
          },
        ]
      : [],
  )
  const chips: Omit<Placed, 'lane' | 'center' | 'x'>[] = [...wallets]
  if (row.gwei !== undefined) {
    chips.push({
      name: 'ours',
      icon: '',
      option: undefined,
      gwei: row.gwei,
      multiple: undefined,
      usd: row.usd,
      ours: true,
    })
  }
  chips.sort((a, b) => b.gwei - a.gwei)
  const starts = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  return chips.map((w) => {
    const chip = chipWidth(w)
    const x = (toX(w.gwei) / 100) * width
    const options = starts.map((start, lane) => {
      const center = Math.max(
        Math.min(x, start - CHIP_GAP - chip / 2, width - chip / 2),
        chip / 2,
      )
      const overlap = Math.max(0, center + chip / 2 - (start - CHIP_GAP))
      return { lane, center, cost: overlap * 1000 + Math.abs(center - x) }
    })
    const { lane, center } = options.reduce((a, b) => (b.cost < a.cost ? b : a))
    starts[lane] = center - chip / 2
    return { ...w, lane, center, x }
  })
}

export function Track({
  row,
  height = 76,
  className,
}: {
  row: TierRow
  /** In pixels */
  height?: number
  className?: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const ours = row.gwei
  const chipWidth = (w: { gwei: number; ours?: boolean }) =>
    // Padding, plus the icon for wallets, plus about 7.7px a digit, so the
    // estimate is never short of the chip and a chip at the edge stays inside
    (w.ours ? 18 : 36) + gwei(w.gwei).length * 7.7
  const placed = width > 0 ? place(row, width, chipWidth) : []
  const top = placed.find((w) => !w.ours)

  return (
    <div ref={ref} className={cn('relative', className)} style={{ height }}>
      {DECADES.map((p) => (
        <span
          key={p}
          className="absolute inset-y-0 border-divider border-l border-dashed opacity-70"
          style={{ left: `${toX(10 ** p)}%` }}
        />
      ))}
      <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 flex h-[3px] overflow-hidden rounded-full opacity-45">
        {BAND_SPANS.map((band) => (
          <span
            key={band.key}
            style={{ width: `${band.to - band.from}%`, background: band.color }}
          />
        ))}
      </div>
      {ours !== undefined && top && (
        <span
          className="-translate-y-1/2 absolute top-1/2 h-2.5 rounded-full"
          style={{
            left: `${toX(ours)}%`,
            width: `${toX(top.gwei) - toX(ours)}%`,
            background: `linear-gradient(90deg, color-mix(in oklab, ${OVER} 10%, transparent), color-mix(in oklab, ${OVER} 70%, transparent))`,
          }}
        />
      )}
      {placed
        .filter((w) => !w.ours)
        .map((w) => (
          <span
            key={w.name}
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-2 rounded-full ring-2 ring-surface-primary"
            style={{ left: w.x, background: OVER }}
          />
        ))}
      {placed.map((w) =>
        w.ours ? (
          <Tooltip key={w.name}>
            <TooltipTrigger
              className={cn(
                '-translate-x-1/2 absolute flex h-6 items-center rounded-full bg-primary px-2 font-bold text-primary-invert text-xs tabular-nums shadow-xs',
                w.lane === 0 ? 'top-0.5' : 'bottom-0.5',
              )}
              style={{ left: w.center }}
            >
              <Gwei value={w.gwei} zerosClassName="opacity-60" />
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-0.5 text-xs">
              <span className="font-bold">
                Our estimated {row.name.toLowerCase()} tip
              </span>
              <span className="tabular-nums">
                {gwei(w.gwei)} gwei
                {w.usd !== undefined && `, ${formatFee(w.usd)} per transfer`}
              </span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip key={w.name}>
            <TooltipTrigger
              className={cn(
                '-translate-x-1/2 absolute flex h-6 items-center gap-1 rounded-full border border-divider bg-surface-primary py-0.5 pr-2 pl-1 font-bold text-xs tabular-nums shadow-xs',
                w.lane === 0 ? 'top-0.5' : 'bottom-0.5',
              )}
              style={{ left: w.center }}
            >
              <WalletIcon icon={w.icon} className="rounded-full" />
              <Gwei value={w.gwei} zerosClassName="opacity-50" />
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-0.5 text-xs">
              <span className="font-bold">
                {w.name} · “{w.option}”
              </span>
              <span className="tabular-nums">
                {gwei(w.gwei)} gwei
                {w.usd !== undefined && `, ${formatFee(w.usd)} per transfer`}
              </span>
              {w.multiple && (
                <span className="text-secondary tabular-nums">
                  {multiple(w.multiple)} our estimated {row.name.toLowerCase()}{' '}
                  tip
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        ),
      )}
      {ours !== undefined && (
        <span
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-4 rounded-full ring-[3px] ring-surface-primary transition-[left] duration-700 motion-reduce:transition-none"
          style={{ left: `${toX(ours)}%`, background: OURS }}
        />
      )}
    </div>
  )
}

/** Ours, the three wallets and the ribbon, as one line */
export function TrackLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-secondary text-xs',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full" style={{ background: OURS }} />
        Our estimated tip
      </span>
      {WALLETS.map((wallet) => (
        <span key={wallet.name} className="flex items-center gap-1.5">
          <WalletIcon icon={wallet.icon} className="size-3.5" />
          {wallet.name}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-5 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${OVER})` }}
        />
        Above our estimate
      </span>
    </div>
  )
}

/** Powers of ten under the tracks; on phones every other one */
export function TrackAxis() {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-4">
        {DECADES.map((p) => (
          <span
            key={p}
            className={cn(
              'absolute top-0.5 text-2xs text-secondary',
              p === LO
                ? ''
                : p === HI
                  ? '-translate-x-full'
                  : '-translate-x-1/2',
              p % 2 !== 0 && p !== HI && 'max-md:hidden',
            )}
            style={{ left: `${toX(10 ** p)}%` }}
          >
            <Gwei value={10 ** p} zerosClassName="opacity-50" />
          </span>
        ))}
      </div>
    </div>
  )
}
