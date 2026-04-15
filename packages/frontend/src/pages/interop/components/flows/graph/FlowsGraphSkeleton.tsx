import { useMemo } from 'react'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { FlowsLogo } from './FlowsLogo'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphSkeletonProps {
  width: number
  height: number
  isSmallScreen: boolean
}

export function FlowsGraphSkeleton({
  width,
  height,
  isSmallScreen,
}: FlowsGraphSkeletonProps) {
  const { selectedChains } = useInteropFlows()

  const layout = useMemo(
    () =>
      computeGraphLayout(
        selectedChains,
        selectedChains.map((chainId) => ({ chainId, totalVolume: 1 })),
        width,
        height,
        isSmallScreen,
      ),
    [selectedChains, width, height, isSmallScreen],
  )

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      className="animate-pulse"
    >
      <BackgroundRoads
        chainIds={selectedChains}
        layout={layout}
        centerX={width / 2}
        centerY={height / 2}
      />
      <FlowsLogo
        centerX={width / 2}
        centerY={height / 2}
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
            className="fill-secondary/20"
          />
        )
      })}
    </svg>
  )
}
