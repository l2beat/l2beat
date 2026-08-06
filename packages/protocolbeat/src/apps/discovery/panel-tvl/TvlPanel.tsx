import { formatLargeNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getTvl } from '../../../api/api'
import type { ApiTvlEntry } from '../../../api/types'
import { LoadingState } from '../../../components/LoadingState'

export function TvlPanel() {
  const { project } = useParams()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const tvlResponse = useQuery({
    queryKey: ['projects', project, 'tvl'],
    queryFn: () => getTvl(project),
  })
  const response = tvlResponse.data
  if (response === undefined) {
    return <LoadingState />
  }

  return (
    <div className="flex h-full w-full flex-col overflow-auto text-sm">
      {response.map((entry) => (
        <TvlRow key={entry.ticker} entry={entry} />
      ))}
    </div>
  )
}

function TvlRow(props: { entry: ApiTvlEntry }) {
  return (
    <div className="flex items-center gap-2 border-coffee-600 border-b px-3 py-2">
      <img
        src={props.entry.iconURL}
        alt=""
        className="size-5 shrink-0 rounded-full"
      />
      <span className="font-bold">{props.entry.ticker}</span>
      <span className="ml-auto tabular-nums">
        ${formatLargeNumber(props.entry.tvl)}
      </span>
    </div>
  )
}
