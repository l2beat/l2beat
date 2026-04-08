import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { FlowsGraph } from './FlowsGraph'

export function FlowsGraphPanel() {
  const { selectedChains } = useInteropFlows()
  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref: containerRef })

  return (
    <div
      className="h-[400px] w-full md:h-[580px] lg:h-[700px]"
      ref={containerRef}
    >
      {isLoading || !data || !width || !height ? (
        <Skeleton className="h-full w-full rounded-lg" />
      ) : (
        <FlowsGraph data={data} width={width} height={height} />
      )}
    </div>
  )
}
