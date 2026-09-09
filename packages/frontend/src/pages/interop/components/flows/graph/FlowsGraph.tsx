import { useMemo } from 'react'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
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
  baseDollarsPerParticle?: number
  topChainId?: string
}

export function FlowsGraph({
  interopChains,
  visibleChainIds,
  data,
  size,
  isSmallScreen,
  baseDollarsPerParticle,
  topChainId,
}: FlowsGraphProps) {
  const layout = useMemo(
    () =>
      computeGraphLayout(
        visibleChainIds,
        data.chainData,
        size,
        isSmallScreen,
        topChainId,
      ),
    [visibleChainIds, data.chainData, size, isSmallScreen, topChainId],
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
        baseDollarsPerParticle={baseDollarsPerParticle}
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
