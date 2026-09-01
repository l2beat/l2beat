import { useMemo } from 'react'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { FlowsLogo } from './FlowsLogo'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphSkeletonProps {
  size: number
  isSmallScreen: boolean
}

export function FlowsGraphSkeleton({
  size,
  isSmallScreen,
}: FlowsGraphSkeletonProps) {
  const { selectedChains } = useInteropFlows()

  const layout = useMemo(
    () =>
      computeGraphLayout(
        selectedChains,
        selectedChains.map((chainId) => ({ chainId, totalVolume: 1 })),
        size,
        isSmallScreen,
      ),
    [selectedChains, size, isSmallScreen],
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
      />
      <FlowsLogo
        centerX={center}
        centerY={center}
        isSmallScreen={isSmallScreen}
      />
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
