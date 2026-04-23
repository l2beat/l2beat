import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { CursorClickIcon } from '~/icons/CursorClick'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { MIN_SELECTED_CHAINS, MIN_SELECTED_PROTOCOLS } from '../consts'
import { FlowsGraph } from './FlowsGraph'
import { FlowsGraphSkeleton } from './FlowsGraphSkeleton'
import { InactiveChainsDialog } from './InactiveChainsDialog'

interface FlowsGraphPanelProps {
  activeChains: InteropChainWithIcon[]
  data: InteropFlowsData | undefined
  hasEnoughChains: boolean
  hasEnoughProtocols: boolean
  inactiveChains: InteropChainWithIcon[]
  isLoading: boolean
}

export function FlowsGraphPanel({
  activeChains,
  data,
  hasEnoughChains,
  hasEnoughProtocols,
  inactiveChains,
  isLoading,
}: FlowsGraphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref: containerRef })
  const size =
    width && height ? getSteppedSize(Math.min(width, height)) : undefined
  const isSmallScreen = size ? size <= 500 : false
  const shouldRenderInactiveChainsInfo = hasEnoughChains && hasEnoughProtocols
  const shouldShowInactiveChainsInfo =
    !!data && inactiveChains.length > 0 && !isLoading

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center max-lg:order-2">
      <div
        id="flows-graph"
        className="flex aspect-square min-h-0 w-full flex-1 items-center justify-center pb-6"
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
            interopChains={activeChains}
            visibleChainIds={activeChains.map((chain) => chain.id)}
            data={data}
            size={size}
            isSmallScreen={isSmallScreen}
          />
        )}
      </div>
      {shouldRenderInactiveChainsInfo && (
        <div className="mt-3 flex min-h-6 w-full items-center justify-center gap-1 pt-1">
          {shouldShowInactiveChainsInfo ? (
            <>
              <span className="font-normal text-secondary text-xs leading-none md:text-base">
                No transfers detected for
              </span>
              <InactiveChainsDialog chains={inactiveChains} />
            </>
          ) : isLoading ? (
            <Skeleton className="h-4 w-40 md:h-5" />
          ) : null}
        </div>
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
