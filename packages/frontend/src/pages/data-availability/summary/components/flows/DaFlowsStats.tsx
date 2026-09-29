import { formatInteger } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { FlowsParticleLegend } from '~/pages/interop/components/flows/FlowsParticleLegend'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { DaFlowsGraph } from './buildDaFlowsGraph'
import { formatPosted } from './formatPosted'

const BYTES_UNIT = { label: 'data', format: formatPosted }

interface Props {
  daLayerName: string
  graph: DaFlowsGraph | undefined
  bytesPerParticle: number | undefined
  isLoading: boolean
}

export function DaFlowsStats({
  daLayerName,
  graph,
  bytesPerParticle,
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
            title="Projects posting"
            value={formatInteger(graph?.posters.length ?? 0)}
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
        unit={BYTES_UNIT}
      />
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
