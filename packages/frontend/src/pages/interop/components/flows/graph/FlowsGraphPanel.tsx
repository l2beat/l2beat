import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { FlowsGraph } from './FlowsGraph'

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
  const isSmallScreen = width ? width <= 500 : false

  return (
    <div
      id="flows-graph"
      className="aspect-square w-full max-w-[600px] max-lg:order-2 max-lg:py-6"
      ref={containerRef}
    >
      {isLoading || !data || !width || !height ? (
        <Skeleton className="h-full w-full rounded-lg" />
      ) : (
        <FlowsGraph
          interopChains={interopChains}
          data={data}
          width={width}
          height={height}
          isSmallScreen={isSmallScreen}
        />
      )}
    </div>
  )
}
