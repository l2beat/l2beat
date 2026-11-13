import { useMemo } from 'react'
import type { InteropFlowsGraphData } from '~/server/features/layer2s/interop/getInteropFlowsOverview'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { FlowsLogo } from './FlowsLogo'
import { ParticleLayer } from './ParticleLayer'
import { getChainLabel } from './utils/chainLabel'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  interopChains: InteropChainWithIcon[]
  visibleChainIds: string[]
  data: InteropFlowsGraphData
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
  const labels = useMemo(
    () =>
      new Map(
        interopChains.map((chain) => [
          chain.id,
          getChainLabel(
            chain.name,
            data.chainData.find((c) => c.chainId === chain.id)?.netFlow ?? 0,
            isSmallScreen,
          ),
        ]),
      ),
    [interopChains, data.chainData, isSmallScreen],
  )

  const layout = useMemo(
    () =>
      computeGraphLayout(
        visibleChainIds,
        data.chainData,
        size,
        isSmallScreen,
        topChainId,
        labels,
      ),
    [visibleChainIds, data.chainData, size, isSmallScreen, topChainId, labels],
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
        labels={labels}
        isSmallScreen={isSmallScreen}
      />
    </svg>
  )
}
