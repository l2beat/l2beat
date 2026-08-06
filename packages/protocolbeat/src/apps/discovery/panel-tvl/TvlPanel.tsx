import { formatLargeNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getTvl } from '../../../api/api'
import type { ApiTvlEntry } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { LoadingState } from '../../../components/LoadingState'
import { usePanelStore } from '../store/panel-store'

export function TvlPanel() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected[0])

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const tvlResponse = useQuery({
    queryKey: ['projects', project, 'tvl', selectedAddress],
    queryFn: () => getTvl(project, selectedAddress as string),
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
    <div className="flex h-full w-full flex-col overflow-auto text-sm">
      <div className="flex items-center gap-2 border-coffee-600 border-b px-3 py-2 font-bold">
        <span>Total</span>
        <span className="ml-auto tabular-nums">
          ${formatLargeNumber(total)}
        </span>
      </div>
      {response.map((entry) => (
        <TvlRow key={entry.ticker} entry={entry} />
      ))}
    </div>
  )
}

function TvlRow(props: { entry: ApiTvlEntry }) {
  return (
    <div className="flex items-center gap-2 border-coffee-600 border-b px-3 py-2">
      {props.entry.iconURL ? (
        <img
          src={props.entry.iconURL}
          alt=""
          className="size-5 shrink-0 rounded-full"
        />
      ) : (
        <div className="size-5 shrink-0 rounded-full bg-coffee-600" />
      )}
      <span className="font-bold">{props.entry.ticker}</span>
      <span className="ml-auto tabular-nums">
        ${formatLargeNumber(props.entry.tvl)}
      </span>
    </div>
  )
}
