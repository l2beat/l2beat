import { useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { computeGraphLayout } from './utils/computeGraphLayout'

export function FlowsGraph() {
  const { selectedChains } = useInteropFlows()
  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref: containerRef })

  const layout = useMemo(
    () =>
      computeGraphLayout(
        selectedChains,
        data?.chainVolumes ?? [],
        width ?? 0,
        height ?? 0,
      ),
    [selectedChains, data?.chainVolumes, width, height],
  )

  return (
    <div
      className="h-[400px] w-full md:h-[580px] lg:h-[700px]"
      ref={containerRef}
    >
      {isLoading || !data || !width || !height ? (
        <Skeleton className="h-full w-full rounded-lg" />
      ) : (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <BackgroundRoads
            chainIds={selectedChains}
            layout={layout}
            centerX={width / 2}
            centerY={height / 2}
            hoveredChainId={null}
          />
        </svg>
      )}
    </div>
  )
}
