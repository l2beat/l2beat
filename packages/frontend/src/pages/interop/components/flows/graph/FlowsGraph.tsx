import { useMemo } from 'react'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { FlowsLogo } from './FlowsLogo'
import { ParticleLayer } from './ParticleLayer'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  interopChains: InteropChainWithIcon[]
  visibleChainIds: string[]
  data: InteropFlowsData
  size: number
  isSmallScreen: boolean
}

export function FlowsGraph({
  interopChains,
  visibleChainIds,
  data,
  size,
  isSmallScreen,
}: FlowsGraphProps) {
  const layout = useMemo(
    () =>
      computeGraphLayout(visibleChainIds, data.chainData, size, isSmallScreen),
    [visibleChainIds, data.chainData, size, isSmallScreen],
  )

  const center = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
    >
      <BackgroundRoads
        chainIds={visibleChainIds}
        layout={layout}
        centerX={center}
        centerY={center}
      />
      <FlowsLogo
        centerX={center}
        centerY={center}
        isSmallScreen={isSmallScreen}
      />
      <ParticleLayer
        flows={data.flows}
        chainData={data.chainData}
        visibleChainIds={visibleChainIds}
        layout={layout}
        interopChains={interopChains}
        centerX={center}
        centerY={center}
        isSmallScreen={isSmallScreen}
      />
      <ChainBubblesLayer
        interopChains={interopChains}
        layout={layout}
        chainData={data.chainData}
        isSmallScreen={isSmallScreen}
      />
    </svg>
  )
}
