import type { GasFeesTipPayers as TipPayers } from '~/server/features/gas-fees/getGasFeesTipping'
import { cn } from '~/utils/cn'
import { formatPeriod, KeyItem, NoDataYet, percent, ShareBar } from './parts'

type Shares = TipPayers['txShares']

const GROUPS = [
  {
    key: 'high',
    label: '1 to 2.5 gwei',
    color: 'var(--chart-stacked-pink)',
    text: 'text-black',
  },
  {
    key: 'middle',
    label: '0.1 to 1 gwei',
    color: 'color-mix(in oklab, var(--chart-stacked-pink) 70%, black)',
    text: 'text-white',
  },
  {
    key: 'low',
    label: 'Under 0.1 gwei',
    color: 'var(--chart-stacked-blue)',
    text: 'text-black',
  },
] as const

/** Below this share a slice can't hold its number. The last slice shows it beside the bar instead */
const THINNEST_LABELLED = 0.06

export function GasFeesTipPayers({
  payers,
}: {
  payers: TipPayers | undefined
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">Who pays the tips</h3>
        {payers ? (
          <>
            <p className="font-medium text-base">
              The {percent(payers.txShares.high)} of transactions that tip 1 to
              2.5 gwei pay {percent(payers.tipShares.high)} of the tips.
            </p>
            <p className="text-secondary text-xs">
              Ordinary transactions, {formatPeriod(payers.period)}.
            </p>
          </>
        ) : (
          <NoDataYet />
        )}
      </div>
      {payers && (
        <>
          <div className="flex flex-col gap-3 pr-11">
            <Split label="Transactions" shares={payers.txShares} />
            <Split label="Tips paid" shares={payers.tipShares} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            {GROUPS.map((group) => (
              <KeyItem key={group.key} color={group.color}>
                {group.label}
              </KeyItem>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Split({ label, shares }: { label: string; shares: Shares }) {
  const last = shares[GROUPS[GROUPS.length - 1]?.key ?? 'low']
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs">{label}</span>
      <div className="relative font-semibold text-sm tabular-nums">
        <ShareBar
          className="h-11 gap-0.5 rounded-lg"
          parts={GROUPS.map((group) => {
            const labelled = shares[group.key] >= THINNEST_LABELLED
            return {
              key: group.key,
              value: shares[group.key],
              color: group.color,
              className: cn(group.text, labelled && 'px-3'),
              inside: labelled && percent(shares[group.key]),
            }
          })}
        />
        {last < THINNEST_LABELLED && (
          <span className="-translate-y-1/2 absolute top-1/2 left-full ml-2">
            {percent(last)}
          </span>
        )}
      </div>
    </div>
  )
}
