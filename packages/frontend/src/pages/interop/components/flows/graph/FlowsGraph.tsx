import { useMemo } from 'react'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { FlowsLogo } from './FlowsLogo'
import { ParticleLayer } from './ParticleLayer'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  interopChains: InteropChainWithIcon[]
  data: InteropFlowsData
  size: number
  isSmallScreen: boolean
}

export function FlowsGraph({
  interopChains,
  data,
  size,
  isSmallScreen,
}: FlowsGraphProps) {
  const { selectedChains } = useInteropFlows()

  const layout = useMemo(
    () =>
      computeGraphLayout(selectedChains, data.chainData, size, isSmallScreen),
    [selectedChains, data.chainData, size, isSmallScreen],
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
      <ParticleLayer
        flows={data.flows}
        chainData={data.chainData}
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
