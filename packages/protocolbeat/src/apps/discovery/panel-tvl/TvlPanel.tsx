import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { getTvl } from '../../../api/api'
import type { ApiTvlEntry } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { LoadingState } from '../../../components/LoadingState'
import { usePanelStore } from '../store/panel-store'

const COLUMN = 'w-20 shrink-0 text-right'

export function TvlPanel() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected[0])

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const tvlResponse = useQuery({
    queryKey: ['projects', project, 'tvl', selectedAddress],
    queryFn: () => getTvl(selectedAddress as string),
    enabled: selectedAddress !== undefined,
  })

  if (selectedAddress === undefined) {
    return <ActionNeededState message="Select an address to estimate its TVL" />
  }
  if (tvlResponse.isError) {
    return <ActionNeededState message="Failed to estimate TVL" />
  }
  const response = tvlResponse.data
  if (response === undefined) {
    return <LoadingState />
  }
  if (response.length === 0) {
    return <ActionNeededState message="No tokens held by this address" />
  }

  const total = response.reduce((sum, entry) => sum + entry.tvl, 0)

  return (
    <div className="h-full w-full overflow-auto bg-coffee-900">
      <div className="sticky top-0 z-10 flex items-baseline gap-2 border-coffee-600 border-b bg-coffee-800 px-3 py-2">
        <span className="font-bold text-2xs text-coffee-400 uppercase tracking-wider">
          Total
        </span>
        <span className="ml-auto font-bold font-mono text-base text-coffee-200 tabular-nums">
          {formatCurrency(total, 'usd')}
        </span>
      </div>

      <div className="flex items-center gap-3 px-3 py-1 font-bold text-2xs text-coffee-400 uppercase tracking-wider">
        <span className="min-w-0 flex-1">Token</span>
        <span className={COLUMN}>Balance</span>
        <span className={COLUMN}>Price</span>
        <span className={COLUMN}>Value</span>
      </div>

      {response.map((entry) => (
        <TvlRow
          key={`${entry.ticker}-${entry.address}`}
          entry={entry}
          share={total > 0 ? entry.tvl / total : 0}
        />
      ))}
    </div>
  )
}

function TvlRow(props: { entry: ApiTvlEntry; share: number }) {
  return (
    <div className="relative flex items-center gap-3 overflow-hidden px-3 py-1 hover:bg-coffee-800">
      <div
        className="absolute inset-y-0 left-0 bg-coffee-700"
        style={{ width: `${(props.share * 100).toFixed(2)}%` }}
      />
      <div className="relative flex min-w-0 flex-1 items-center gap-2">
        {props.entry.iconURL ? (
          <img
            src={props.entry.iconURL}
            alt=""
            className="size-4 shrink-0 rounded-full"
          />
        ) : (
          <div className="size-4 shrink-0 rounded-full bg-coffee-600" />
        )}
        <span className="truncate font-bold text-coffee-200 text-xs">
          {props.entry.ticker}
        </span>
      </div>
      <Cell>{formatNumber(props.entry.balance)}</Cell>
      <Cell>
        {props.entry.price === undefined
          ? '-'
          : `${formatCurrency(props.entry.price, 'usd')}`}
      </Cell>
      <Cell bright>${formatNumber(props.entry.tvl)}</Cell>
    </div>
  )
}

function Cell(props: { children: ReactNode; bright?: boolean }) {
  return (
    <span
      className={clsx(
        COLUMN,
        'relative font-mono text-xs tabular-nums',
        props.bright ? 'text-coffee-200' : 'text-coffee-400',
      )}
    >
      {props.children}
    </span>
  )
}
