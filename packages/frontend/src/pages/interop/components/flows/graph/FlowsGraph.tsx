import { useMemo } from 'react'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { FlowsLogo } from './FlowsLogo'
import { ParticleLayer } from './ParticleLayer'
import type {
  FlowsGraphData,
  FlowsGraphNode,
  GetFlowsGraphCaption,
} from './types'
import { computeGraphLayout } from './utils/computeGraphLayout'
import type { ParticleScale } from './utils/particleScale'

export interface FlowsGraphOptions {
  baseDollarsPerParticle?: number
  topChainId?: string
  /** Puts this chain in the middle and turns the graph into a hub */
  centerChainId?: string
  /** Unit of `volume`. Defaults to dollars */
  particleScale?: ParticleScale
  /** Line under each chain's name. Defaults to its net flow in dollars */
  getCaption?: GetFlowsGraphCaption
}

interface FlowsGraphProps extends FlowsGraphOptions {
  interopChains: FlowsGraphNode[]
  visibleChainIds: string[]
  data: FlowsGraphData
  size: number
  isSmallScreen: boolean
}

export function FlowsGraph({
  interopChains,
  visibleChainIds,
  data,
  size,
  isSmallScreen,
  baseDollarsPerParticle,
  topChainId,
  centerChainId,
  particleScale,
  getCaption,
}: FlowsGraphProps) {
  const layout = useMemo(
    () =>
      computeGraphLayout(
        visibleChainIds,
        data.chainData,
        size,
        isSmallScreen,
        topChainId,
        centerChainId,
      ),
    [
      visibleChainIds,
      data.chainData,
      size,
      isSmallScreen,
      topChainId,
      centerChainId,
    ],
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
        centerChainId={centerChainId}
      />
      {!centerChainId && (
        <FlowsLogo
          centerX={center}
          centerY={center}
          isSmallScreen={isSmallScreen}
        />
      )}
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
        particleScale={particleScale}
        centerChainId={centerChainId}
      />
      <ChainBubblesLayer
        interopChains={interopChains}
        layout={layout}
        chainData={data.chainData}
        isSmallScreen={isSmallScreen}
        centerChainId={centerChainId}
        getCaption={getCaption}
      />
    </svg>
  )
}
