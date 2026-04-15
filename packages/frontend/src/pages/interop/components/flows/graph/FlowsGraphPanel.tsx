import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { FlowsGraph } from './FlowsGraph'
import { FlowsGraphSkeleton } from './FlowsGraphSkeleton'

interface FlowsGraphPanelProps {
  interopChains: InteropChainWithIcon[]
}

export function FlowsGraphPanel({ interopChains }: FlowsGraphPanelProps) {
  const { selectedChains, selectedProtocols } = useInteropFlows()
  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
    protocolIds: selectedProtocols,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref: containerRef })
  const size =
    width && height ? getSteppedSize(Math.min(width, height)) : undefined
  const isSmallScreen = size ? size <= 500 : false

  return (
    <div
      id="flows-graph"
      className="flex aspect-square min-h-0 w-full flex-1 items-center justify-center pb-6 max-lg:order-2"
      ref={containerRef}
    >
      {!size ? (
        <Skeleton className="h-full w-full rounded-lg" />
      ) : isLoading || !data ? (
        <FlowsGraphSkeleton size={size} isSmallScreen={isSmallScreen} />
      ) : (
        <FlowsGraph
          interopChains={interopChains}
          data={data}
          size={size}
          isSmallScreen={isSmallScreen}
        />
      )}
    </div>
  )
}

const RESIZE_STEP = 50

function getSteppedSize(size: number) {
  return Math.max(Math.round(size / RESIZE_STEP) * RESIZE_STEP, 350)
}
