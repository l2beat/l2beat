import { formatSeconds } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectIconList } from '~/components/ProjectIconList'
import { FlowsParticleLegend } from '~/pages/interop/components/flows/FlowsParticleLegend'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { DaFlowsGraph } from './buildDaFlowsGraph'
import { type DaFlowsUnit, TIME_SCALE } from './daFlowsUnit'
import { formatPosted } from './formatPosted'

interface Props {
  daLayerName: string
  graph: DaFlowsGraph | undefined
  bytesPerParticle: number | undefined
  unit: DaFlowsUnit
  isLoading: boolean
}

export function DaFlowsStats({
  daLayerName,
  graph,
  bytesPerParticle,
  unit,
  isLoading,
}: Props) {
  const top = graph?.posters[0]

  return (
    <div className="@container flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="font-bold text-heading-20">Data posted</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        For past day by projects that post their data to {daLayerName}
      </div>
      <div className="mt-1.5 space-y-2">
        <div className="grid @min-[400px]:grid-cols-2 grid-cols-1 gap-2">
          <Stat
            title="Total"
            value={formatPosted(graph?.totalPosted ?? 0)}
            isLoading={isLoading}
          />
          <Stat
            title="Projects tracked"
            value={
              <ProjectIconList
                projects={(graph?.posters ?? []).flatMap((poster) =>
                  poster.iconUrl
                    ? [
                        {
                          id: poster.id,
                          name: poster.name,
                          iconUrl: poster.iconUrl,
                          href: poster.href,
                        },
                      ]
                    : [],
                )}
                dialog={{
                  title: 'Projects tracked',
                  description: `Search for projects posting to ${daLayerName}`,
                  searchPlaceholder: 'Start typing to find project...',
                  emptyText: 'No projects found.',
                }}
                className="h-7 font-medium text-sm"
              />
            }
            isLoading={isLoading}
          />
        </div>
        <HorizontalSeparator className="my-4" />
        <Stat
          title="Top poster"
          isLoading={isLoading}
          className="p-4"
          value={
            top ? (
              <div className="flex flex-col items-center gap-0.5 text-heading-18">
                {top.href ? (
                  <a href={top.href} className="text-brand hover:underline">
                    {top.name}
                  </a>
                ) : (
                  <span className="text-brand">{top.name}</span>
                )}
                <span className="text-center font-medium text-label-value-13 text-secondary leading-tight">
                  {formatPercent(top.share)} of data ({formatPosted(top.posted)}
                  )
                </span>
              </div>
            ) : (
              '-'
            )
          }
        />
      </div>
      <FlowsParticleLegend
        className="mt-auto pt-4"
        totalVolume={graph?.totalPosted ?? 0}
        dollarsPerParticle={bytesPerParticle}
        isLoading={isLoading}
        unit={{
          label: 'data',
          format: formatPosted,
          formatParticle: unit.format,
        }}
      />
      {!isLoading && (
        <div className="mt-1 space-y-1 text-center font-medium text-label-value-14 text-secondary">
          <div>
            1 burst ≈ <span className="font-bold text-brand">1 batch</span>
          </div>
          <div>
            1 second ≈{' '}
            <span className="font-bold text-brand">
              {formatSeconds(TIME_SCALE, { fullUnit: true })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({
  title,
  value,
  isLoading,
  className,
}: {
  title: string
  value: ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-lg border border-divider bg-surface-primary px-4 py-2',
        className,
      )}
    >
      <span className="font-medium text-label-value-14 text-secondary">
        {title}
      </span>
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <div className="font-bold text-heading-20">{value}</div>
      )}
    </div>
  )
}
