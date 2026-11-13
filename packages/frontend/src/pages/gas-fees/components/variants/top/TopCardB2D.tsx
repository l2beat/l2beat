import { cn } from '~/utils/cn'
import { formatFee } from '../../metrics'
import { Label } from '../../parts'
import { B2Frame, Info, NOTES, OVERTIP } from './B2Frame'
import {
  BANDS,
  FIT,
  OVER,
  OVER_TEXT,
  PAYERS,
  PERIOD,
  SPEED,
  Swatch,
  ThickBar,
  TIPS,
  usdM,
} from './shared'
import {
  At,
  bandSpans,
  CurveLine,
  MARKS,
  OURS_MARK,
  SpeedPlot,
  USD_AXIS,
} from './speedPlot'

/**
 * B2D · chart-led: the price of speed takes two thirds of the width and
 * grows taller, and overtipping and who pays stack beside it as compact
 * number + bar blocks. Pink means "above our estimated fast tip" in all three, and
 * the band colours run through the curve's marks, its floor and the bars
 */
export function TopCardB2D() {
  return (
    <B2Frame>
      <div className="grid grid-cols-1 gap-8 border-divider border-t pt-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-0">
        <section className="flex min-w-0 flex-col gap-5 lg:pr-8">
          <Head
            label={
              <>
                Price of speed · {PERIOD}
                <Info>{NOTES.speed}</Info>
              </>
            }
            value={`+${formatFee(SPEED.extra)}`}
            note={
              <>
                a transfer for 2 gwei over our estimated fast tip gets you in{' '}
                <b className="text-primary">
                  {SPEED.fromSure - SPEED.toSure}s sooner
                </b>
                : {SPEED.fromSure}s to {SPEED.toSure}s, 99% sure
              </>
            }
          />
          <Plot />
          <p className="text-2xs text-secondary">{NOTES.curve}</p>
        </section>

        <aside className="flex flex-col border-divider max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-8">
          <SideBlock
            label={
              <>
                Overtipping
                <Info>{NOTES.ordinary}</Info>
              </>
            }
            value={usdM(OVERTIP)}
            note={`of ${usdM(TIPS.ordinaryUsd)} ordinary tips went above our estimated fast tip`}
          >
            <ThickBar
              height="h-9"
              parts={[
                {
                  key: 'fit',
                  label: 'Up to our estimated tip',
                  value: TIPS.atFastUsd,
                  color: FIT,
                  inside: usdM(TIPS.atFastUsd),
                  text: 'text-primary-invert',
                },
                {
                  key: 'over',
                  label: 'Above it',
                  value: OVERTIP,
                  color: OVER,
                  inside: usdM(OVERTIP),
                  text: 'text-white',
                },
              ]}
            />
          </SideBlock>
          <SideBlock
            className="mt-6 border-divider border-t pt-6"
            label="Who pays the tips"
            value={`${PAYERS.tips.high}%`}
            note={`of tips come from the ${PAYERS.txs.high}% of transactions tipping 1 to 2.5 gwei`}
          >
            <ShareBars />
          </SideBlock>
        </aside>
      </div>
    </B2Frame>
  )
}

function Head({
  label,
  value,
  note,
}: {
  label: React.ReactNode
  value: string
  note: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <span className="flex flex-wrap items-baseline gap-x-3">
        <span
          className="whitespace-nowrap font-bold text-4xl tabular-nums tracking-tight"
          style={{ color: OVER_TEXT }}
        >
          {value}
        </span>
        <span className="text-secondary text-sm">{note}</span>
      </span>
    </div>
  )
}

/** Label, then the number with a short note beside it, then the picture */
function SideBlock({
  label,
  value,
  note,
  children,
  className,
}: {
  label: React.ReactNode
  value: string
  note: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Label>{label}</Label>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span
          className="font-bold text-3xl tabular-nums leading-none tracking-tight"
          style={{ color: OVER_TEXT }}
        >
          {value}
        </span>
        <span className="text-secondary text-xs leading-snug">{note}</span>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/** The curve with "above our fast tip" in pink and the tip bands on its floor */
function Plot() {
  const axis = USD_AXIS
  const ours = OURS_MARK
  return (
    <SpeedPlot
      axis={axis}
      className="h-64 md:h-[340px]"
      back={
        ours && (
          <div
            className="absolute inset-y-0 right-0"
            style={{
              left: `${axis.x(ours.usd)}%`,
              background: `linear-gradient(90deg, color-mix(in oklab, ${OVER} 9%, transparent), color-mix(in oklab, ${OVER} 3%, transparent))`,
            }}
          >
            <span
              className="absolute top-2 left-3 font-semibold text-2xs uppercase tracking-wider"
              style={{ color: OVER_TEXT }}
            >
              Above our estimated fast tip
            </span>
          </div>
        )
      }
      front={
        <>
          {ours && (
            <CurveLine axis={axis} from={ours.usd} color={OVER} width={3} />
          )}
          <div className="absolute inset-x-0 bottom-0 flex h-1 translate-y-1/2 overflow-hidden rounded-full">
            {bandSpans(axis).map((band) => (
              <span
                key={band.key}
                className="h-full"
                style={{
                  width: `${band.to - band.from}%`,
                  background: band.color,
                }}
              />
            ))}
          </div>
          {MARKS.map((mark, i) => {
            const last = i === MARKS.length - 1
            return (
              <At
                key={mark.name}
                axis={axis}
                usd={mark.usd}
                seconds={mark.seconds}
              >
                <span
                  className={cn(
                    '-translate-x-1/2 -translate-y-1/2 absolute rounded-full ring-[3px] ring-surface-primary',
                    mark.ours ? 'size-[18px]' : 'size-4',
                  )}
                  style={{ background: mark.color }}
                />
                <span
                  className={cn(
                    'absolute flex flex-col whitespace-nowrap text-xs tabular-nums leading-tight [text-shadow:0_0_3px_var(--surface-primary),0_0_3px_var(--surface-primary),0_0_6px_var(--surface-primary)]',
                    mark.ours ? 'top-4' : 'bottom-4',
                    i === 0 || mark.ours
                      ? '-left-2'
                      : last
                        ? '-right-2 items-end'
                        : '-translate-x-1/2 items-center',
                  )}
                >
                  <b>{mark.ours ? 'Our estimated fast tip' : mark.name}</b>
                  <span className="text-2xs text-secondary max-md:hidden">
                    {formatFee(mark.cost)} · {mark.seconds}s
                  </span>
                </span>
              </At>
            )
          })}
        </>
      }
    />
  )
}

/** Two 100% bars, transactions and tips paid, split by tip band */
function ShareBars() {
  const rows = [
    { key: 'txs', label: 'Transactions', shares: PAYERS.txs },
    { key: 'tips', label: 'Tips paid', shares: PAYERS.tips },
  ] as const
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        let at = 0
        const spans = BANDS.map((band) => {
          const share = row.shares[band.key]
          const span = { band, from: at, to: at + share, share }
          at += share
          return span
        })
        return (
          <div key={row.key} className="flex flex-col gap-1">
            <Label>{row.label}</Label>
            <Bar spans={spans} />
          </div>
        )
      })}
      <div className="mt-1 flex flex-col gap-1 text-xs">
        {[...BANDS].reverse().map((band) => (
          <span key={band.key} className="flex items-center gap-1.5">
            <Swatch color={band.color} className="size-2" />
            <span className="text-secondary">{band.label}</span>
            <span className="ml-auto text-secondary tabular-nums">
              {PAYERS.txs[band.key]}% of txs
            </span>
            <b className="w-20 text-right tabular-nums">
              {PAYERS.tips[band.key]}% of tips
            </b>
          </span>
        ))}
      </div>
    </div>
  )
}

function Bar({
  spans,
}: {
  spans: {
    band: (typeof BANDS)[number]
    from: number
    to: number
    share: number
  }[]
}) {
  return (
    <div className="relative h-8 font-semibold text-xs tabular-nums">
      {spans.map((span, i) => (
        <span
          key={span.band.key}
          className={cn(
            'absolute inset-y-0 flex items-center justify-center border-surface-primary',
            span.band.text,
            i > 0 && 'border-l-2',
            i === 0 && 'rounded-l-md',
            i === spans.length - 1 && 'rounded-r-md',
          )}
          style={{
            left: `${span.from}%`,
            width: `${span.to - span.from}%`,
            background: span.band.color,
          }}
        >
          {span.share >= 9 && `${span.share}%`}
        </span>
      ))}
    </div>
  )
}
