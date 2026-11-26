import type { GasFeesTipPayers as TipPayers } from '~/server/features/gas-fees/getGasFeesTipping'
import {
  ACCENT,
  formatPeriod,
  Info,
  KeyItem,
  Label,
  NoDataYet,
  percent,
  ShareBar,
  usd,
} from './parts'
import { OVER, TIP_BANDS } from './tipParts'

/** What our fast tip covers: ink, a step back so the pink reads first */
const FIT = 'color-mix(in oklab, var(--primary) 78%, var(--surface-primary))'
/** A narrower part can't hold its amount, which then goes in the key */
const NARROWEST_LABELLED = 0.22
/** A thinner slice can't hold its share, which the key under the bars has */
const THINNEST_LABELLED = 0.09

/** What ordinary transactions tipped above our fast tip */
export function GasFeesOvertipping({
  payers,
}: {
  payers: TipPayers | undefined
}) {
  if (!payers) {
    return (
      <div className="flex flex-col gap-3">
        <Label>Overtipping</Label>
        <NoDataYet />
      </div>
    )
  }
  const over = payers.ordinaryUsd - payers.atFastUsd
  const parts = [
    {
      key: 'fit',
      label: 'Up to our estimated tip',
      value: payers.atFastUsd,
      color: FIT,
      className: 'text-primary-invert',
    },
    {
      key: 'over',
      label: 'Above it',
      value: over,
      color: OVER,
      className: 'text-white',
    },
  ]
  const share = (value: number) =>
    payers.ordinaryUsd > 0 ? value / payers.ordinaryUsd : 0
  return (
    <Block
      label={
        <>
          Overtipping
          <Info about="overtipping">
            Ordinary transactions, {formatPeriod(payers.period)}. Ordinary means
            a tip under 2.5 gwei. Higher tips buy a place near the front of the
            block, which our estimated fast tip doesn’t aim for.
          </Info>
        </>
      }
      value={usd(over)}
      note={`of ${usd(payers.ordinaryUsd)} ordinary tips went above our estimated fast tip`}
    >
      <div className="flex flex-col gap-1.5">
        <ShareBar
          className="h-9 gap-[3px] rounded-lg font-semibold text-sm tabular-nums"
          parts={parts.map((part) => {
            const labelled = share(part.value) >= NARROWEST_LABELLED
            return {
              ...part,
              // Padding would hold a thin part wider than its share
              className: labelled ? `${part.className} px-3` : undefined,
              inside: labelled && usd(part.value),
            }
          })}
        />
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs">
          {parts.map((part) => (
            <KeyItem key={part.key} color={part.color}>
              <span>{part.label}</span>
              <b className="tabular-nums">
                {share(part.value) < NARROWEST_LABELLED &&
                  `${usd(part.value)}, `}
                {percent(share(part.value))}
              </b>
            </KeyItem>
          ))}
        </div>
      </div>
    </Block>
  )
}

/** How unevenly the tips are paid: most transactions tip little, and a few pay most of the tips */
export function GasFeesTipPayers({
  payers,
}: {
  payers: TipPayers | undefined
}) {
  if (!payers) {
    return (
      <div className="flex flex-col gap-3">
        <Label>Who pays the tips</Label>
        <NoDataYet />
      </div>
    )
  }
  const rows = [
    { key: 'txs', label: 'Transactions', shares: payers.txShares },
    { key: 'tips', label: 'Tips paid', shares: payers.tipShares },
  ]
  return (
    <Block
      label="Who pays the tips"
      value={percent(payers.tipShares.high)}
      note={`of tips come from the ${percent(payers.txShares.high)} of transactions tipping 1 to 2.5 gwei`}
    >
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1">
            <Label>{row.label}</Label>
            <ShareBar
              className="h-8 gap-0.5 rounded-md font-semibold text-xs tabular-nums"
              parts={TIP_BANDS.map((band) => ({
                key: band.key,
                value: row.shares[band.key],
                color: band.color,
                className: `justify-center ${band.text}`,
                inside:
                  row.shares[band.key] >= THINNEST_LABELLED &&
                  percent(row.shares[band.key]),
              }))}
            />
          </div>
        ))}
        <div className="mt-1 flex flex-col gap-1 text-xs">
          {/* The band the headline is about first */}
          {[...TIP_BANDS].reverse().map((band) => (
            <span key={band.key} className="flex items-center gap-1.5">
              <KeyItem color={band.color}>{band.label}</KeyItem>
              <span className="ml-auto tabular-nums">
                {percent(payers.txShares[band.key])} of txs
              </span>
              <b className="w-24 text-right tabular-nums">
                {percent(payers.tipShares[band.key])} of tips
              </b>
            </span>
          ))}
        </div>
      </div>
    </Block>
  )
}

/** A label, the figure with a short note beside it, then the picture */
function Block({
  label,
  value,
  note,
  children,
}: {
  label: React.ReactNode
  value: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span
          className="font-bold text-3xl tabular-nums leading-none tracking-tight"
          style={{ color: ACCENT }}
        >
          {value}
        </span>
        <span className="text-secondary text-xs leading-snug">{note}</span>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}
