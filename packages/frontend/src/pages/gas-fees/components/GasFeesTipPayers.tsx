import { cn } from '~/utils/cn'
import mock from './pageMock.json'

type Shares = typeof mock.payers.txs

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

/** Below this a slice can't hold its number. The last slice shows it beside the bar instead */
const THINNEST_LABELLED = 6

export function GasFeesTipPayers() {
  const { txs, tips, onRound } = mock.payers
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-xl md:text-2xl">Who pays the tips</h2>
        <p className="font-medium text-base">
          {txs.high}% of transactions pay {tips.high}% of the tips. {onRound}%
          tip exactly 1 or 2 gwei.
        </p>
        <p className="text-secondary text-xs">
          Ordinary transactions, past year.
        </p>
      </div>
      <div className="flex flex-col gap-3 pr-8">
        <Split label="Transactions" shares={txs} />
        <Split label="Tips paid" shares={tips} />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-secondary text-xs">
        {GROUPS.map((group) => (
          <li key={group.key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-xs"
              style={{ backgroundColor: group.color }}
            />
            {group.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Split({ label, shares }: { label: string; shares: Shares }) {
  const last = shares[GROUPS[GROUPS.length - 1]?.key ?? 'low']
  return (
    <div className="flex flex-col gap-1">
      <span className="text-secondary text-xs">{label}</span>
      <div className="relative flex h-11 gap-0.5 font-semibold text-sm tabular-nums">
        {GROUPS.map((group) => {
          const share = shares[group.key]
          return (
            <span
              key={group.key}
              className={cn(
                'flex min-w-0 items-center overflow-hidden first:rounded-l-lg last:rounded-r-lg',
                group.text,
                share >= THINNEST_LABELLED && 'px-3',
              )}
              style={{ width: `${share}%`, backgroundColor: group.color }}
            >
              {share >= THINNEST_LABELLED && `${share}%`}
            </span>
          )
        })}
        {last < THINNEST_LABELLED && (
          <span className="-translate-y-1/2 absolute top-1/2 left-full ml-2 text-secondary">
            {last}%
          </span>
        )}
      </div>
    </div>
  )
}
