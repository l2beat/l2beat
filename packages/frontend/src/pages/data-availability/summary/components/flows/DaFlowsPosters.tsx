import { formatSeconds } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { DaFlowsPoster } from './buildDaFlowsGraph'
import type { DaFlowsUnit } from './daFlowsUnit'
import { formatPosted } from './formatPosted'

interface Props {
  posters: DaFlowsPoster[] | undefined
  isLoading: boolean
  highlighted: string | undefined
  unit: DaFlowsUnit
  getNodeId: (posterId: string) => string
  onSelect: (nodeId: string) => void
}

/**
 * The exact numbers behind the graph. Particles show who posts a lot and who
 * posts little; nobody can read a byte count off a stream of dots. The same
 * goes for how often a project posts and how much it posts at once.
 */
export function DaFlowsPosters({
  posters,
  isLoading,
  highlighted,
  unit,
  getNodeId,
  onSelect,
}: Props) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4 lg:max-h-[38rem] dark:bg-header-secondary">
      <div className="font-bold text-heading-20">Posters</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        Select one to follow it on the graph
      </div>
      <ol className="-mx-2 mt-3 min-h-0 flex-1 overflow-y-auto">
        {isLoading || !posters
          ? Array.from({ length: 8 }, (_, i) => (
              <li key={i} className="px-2 py-1.5">
                <Skeleton className="h-5 w-full" />
              </li>
            ))
          : posters.map((poster, index) => {
              const nodeId = getNodeId(poster.id)
              return (
                <li key={poster.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(nodeId)}
                    aria-pressed={highlighted === nodeId}
                    className={cn(
                      'grid w-full grid-cols-[1.25rem_1.25rem_1fr_auto_3rem] items-center gap-x-2 rounded px-2 py-1.5 text-left font-medium text-label-value-14 hover:bg-pure-black/5 dark:hover:bg-pure-white/10',
                      highlighted === nodeId &&
                        'bg-pure-black/5 dark:bg-pure-white/10',
                    )}
                  >
                    <span className="text-right text-secondary tabular-nums">
                      {index + 1}
                    </span>
                    {poster.iconUrl ? (
                      <img
                        src={poster.iconUrl}
                        alt=""
                        className="size-5 rounded-full"
                      />
                    ) : (
                      <span className="size-5" />
                    )}
                    <span className="min-w-0 truncate">{poster.name}</span>
                    <span className="tabular-nums">
                      {formatPosted(poster.posted)}
                    </span>
                    <span className="text-right text-secondary tabular-nums">
                      {formatPercent(poster.share)}
                    </span>
                    {poster.batch && (
                      <span className="col-span-3 col-start-3 truncate text-label-value-12 text-secondary">
                        {unit.format(poster.batch.size)} every{' '}
                        {formatSeconds(poster.batch.interval)}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
      </ol>
    </div>
  )
}
