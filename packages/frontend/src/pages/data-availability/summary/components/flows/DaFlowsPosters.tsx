import { Skeleton } from '~/components/core/Skeleton'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { DaFlowsPoster } from './buildDaFlowsGraph'
import { formatPosted } from './formatPosted'

interface Props {
  posters: DaFlowsPoster[] | undefined
  isLoading: boolean
  highlighted: string | undefined
  getNodeId: (posterId: string) => string
  onSelect: (nodeId: string) => void
}

/**
 * The exact numbers behind the graph. Particles show who posts a lot and who
 * posts little; nobody can read a byte count off a stream of dots.
 */
export function DaFlowsPosters({
  posters,
  isLoading,
  highlighted,
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
                      'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left font-medium text-label-value-14 hover:bg-pure-black/5 dark:hover:bg-pure-white/10',
                      highlighted === nodeId &&
                        'bg-pure-black/5 dark:bg-pure-white/10',
                    )}
                  >
                    <span className="w-5 shrink-0 text-right text-secondary tabular-nums">
                      {index + 1}
                    </span>
                    {poster.iconUrl ? (
                      <img
                        src={poster.iconUrl}
                        alt=""
                        className="size-5 shrink-0 rounded-full"
                      />
                    ) : (
                      <span className="size-5 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      {poster.name}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {formatPosted(poster.posted)}
                    </span>
                    <span className="w-12 shrink-0 text-right text-secondary tabular-nums">
                      {formatPercent(poster.share)}
                    </span>
                  </button>
                </li>
              )
            })}
      </ol>
    </div>
  )
}
