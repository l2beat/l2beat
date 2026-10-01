import { useMemo } from 'react'
import { BackgroundRoads } from './BackgroundRoads'
import { FlowsLogo } from './FlowsLogo'
import { computeGraphLayout } from './utils/computeGraphLayout'
import { useFlowsGraph } from './utils/FlowsGraphContext'

interface FlowsGraphSkeletonProps {
  size: number
  isSmallScreen: boolean
  centerChainId?: string
}

export function FlowsGraphSkeleton({
  size,
  isSmallScreen,
  centerChainId,
}: FlowsGraphSkeletonProps) {
  const { selectedChains } = useFlowsGraph()

  const layout = useMemo(
    () =>
      computeGraphLayout(
        selectedChains,
        selectedChains.map((chainId) => ({ chainId, totalVolume: 1 })),
        size,
        isSmallScreen,
        undefined,
        centerChainId,
      ),
    [selectedChains, size, isSmallScreen, centerChainId],
  )

  const center = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
      className="animate-pulse"
    >
      <BackgroundRoads
        chainIds={selectedChains}
        layout={layout}
        centerX={center}
        centerY={center}
        centerChainId={centerChainId}
      />
      {!centerChainId && (
        <FlowsLogo
          centerX={center}
          centerY={center}
          isSmallScreen={isSmallScreen}
        />
      )}
      {selectedChains.map((chainId) => {
        const nodeLayout = layout.get(chainId)
        if (!nodeLayout) return null
        return (
          <circle
            key={chainId}
            cx={nodeLayout.x}
            cy={nodeLayout.y}
            r={nodeLayout.radius}
            className="fill-zinc-100 dark:fill-zinc-900"
          />
        )
      })}
    </svg>
  )
}
