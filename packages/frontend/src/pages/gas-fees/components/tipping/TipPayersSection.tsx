import type { TipPayers } from '~/server/features/gas-fees/tipping/toTipPayers'
import { formatPeriod, formatShare, formatUsd } from '../../utils/format'
import { Eyebrow } from '../Eyebrow'
import { KeySwatch, ShareBar } from '../ShareBar'
import { TIP_BAND_STYLE } from './tipBands'

const KEY_ORDER = ['high', 'middle', 'low'] as const
const INK = 'var(--primary)'
const PINK = 'var(--brand)'

export function TipPayersSection({
  payers,
}: {
  payers: TipPayers | undefined
}) {
  if (!payers) {
    return (
      <section className="flex flex-col gap-2">
        <Eyebrow>Overtipping</Eyebrow>
        <p className="text-secondary text-sm">
          No complete days of tip data in the past year.
        </p>
      </section>
    )
  }
  const { period, bands } = payers
  const days = `Ordinary transactions, ${formatPeriod(period)}.`
  const aboveUsd = payers.aboveFastTipUsd
  const aboveShare = payers.ordinaryUsd > 0 ? aboveUsd / payers.ordinaryUsd : 0
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <Eyebrow
          infoLabel="About overtipping"
          info={`${days} Ordinary means a tip under 2.5 gwei. Higher tips buy a place near the front of the block, which our estimated fast tip doesn’t aim for.`}
        >
          Overtipping
        </Eyebrow>
        <Figure value={formatUsd(aboveUsd)}>
          of {formatUsd(payers.ordinaryUsd)} ordinary tips went above our
          estimated fast tip
        </Figure>
        <ShareBar
          className="h-9 rounded-md"
          parts={[
            {
              key: 'at',
              value: payers.atFastTipUsd,
              color: INK,
              label: formatUsd(payers.atFastTipUsd),
              textClassName: 'justify-start px-2 text-surface-primary text-sm',
            },
            {
              key: 'above',
              value: aboveUsd,
              color: PINK,
              label: formatUsd(aboveUsd),
              textClassName: 'justify-start px-2 text-sm',
            },
          ]}
        />
        <div className="flex flex-wrap justify-between gap-2 text-label-value-14">
          <span className="flex items-center gap-1.5">
            <KeySwatch color={INK} />
            Up to our estimated tip{' '}
            <strong>{formatShare(1 - aboveShare)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <KeySwatch color={PINK} />
            Above it <strong>{formatShare(aboveShare)}</strong>
          </span>
        </div>
      </section>
      <section className="flex flex-col gap-3 border-divider border-t pt-6">
        <Eyebrow infoLabel="About who pays the tips" info={days}>
          Who pays the tips
        </Eyebrow>
        <Figure value={formatShare(bands.high.tipShare)}>
          of tips come from the {formatShare(bands.high.txShare)} of
          transactions tipping 1 to 2.5 gwei
        </Figure>
        <BandBar title="Transactions" share="txShare" payers={payers} />
        <BandBar title="Tips paid" share="tipShare" payers={payers} />
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1 text-label-value-14">
          {KEY_ORDER.map((band) => (
            <div key={band} className="contents">
              <span className="flex items-center gap-1.5">
                <KeySwatch color={TIP_BAND_STYLE[band].color} />
                {TIP_BAND_STYLE[band].label}
              </span>
              <span>{formatShare(bands[band].txShare)} of txs</span>
              <strong className="text-right">
                {formatShare(bands[band].tipShare)} of tips
              </strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Figure({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  return (
    <p className="flex items-center gap-3">
      <span className="whitespace-nowrap font-bold text-3xl text-brand-deep tabular-nums tracking-tight">
        {value}
      </span>
      <span className="text-secondary text-sm leading-snug">{children}</span>
    </p>
  )
}

function BandBar({
  title,
  share,
  payers,
}: {
  title: string
  share: 'txShare' | 'tipShare'
  payers: TipPayers
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-2xs text-primary uppercase tracking-wider">
        {title}
      </span>
      <ShareBar
        parts={(['low', 'middle', 'high'] as const).map((band) => ({
          key: band,
          value: payers.bands[band][share],
          color: TIP_BAND_STYLE[band].color,
        }))}
      />
    </div>
  )
}
