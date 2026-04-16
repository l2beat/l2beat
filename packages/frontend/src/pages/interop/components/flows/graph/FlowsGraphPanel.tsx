import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { CursorClickIcon } from '~/icons/CursorClick'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { MIN_SELECTED_CHAINS, MIN_SELECTED_PROTOCOLS } from '../consts'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { FlowsGraph } from './FlowsGraph'
import { FlowsGraphSkeleton } from './FlowsGraphSkeleton'

interface FlowsGraphPanelProps {
  interopChains: InteropChainWithIcon[]
}

export function FlowsGraphPanel({ interopChains }: FlowsGraphPanelProps) {
  const { selectedChains, selectedProtocols } = useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS
  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
    },
    { enabled: hasEnoughChains && hasEnoughProtocols },
  )
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
      ) : !hasEnoughChains ? (
        <SelectionOverlay
          message={`Select at least ${MIN_SELECTED_CHAINS} chains to view the graph`}
        />
      ) : !hasEnoughProtocols ? (
        <SelectionOverlay
          message={`Select at least ${MIN_SELECTED_PROTOCOLS} protocol to view the graph`}
        />
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

function SelectionOverlay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Logo
        animated={false}
        width={88 * 1.5}
        height={36 * 1.5}
        opacity={0.2}
        className="pointer-events-none"
      />
      <div className="pointer-events-none flex items-center justify-center pb-6">
        <div className="flex items-center gap-1.5 rounded-lg border border-divider bg-surface-primary px-3 py-2">
          <CursorClickIcon className="size-3.5 shrink-0 fill-brand" />
          <p className="font-medium text-brand text-label-value-14 leading-none">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

const RESIZE_STEP = 50

function getSteppedSize(size: number) {
  return Math.max(Math.round(size / RESIZE_STEP) * RESIZE_STEP, 350)
}
