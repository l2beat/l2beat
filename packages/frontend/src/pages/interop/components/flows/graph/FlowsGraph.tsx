import { useMemo } from 'react'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { ChainBubblesLayer } from './ChainBubblesLayer'
import { ParticleLayer } from './ParticleLayer'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  interopChains: InteropChainWithIcon[]
  data: InteropFlowsData
  width: number
  height: number
  isSmallScreen: boolean
}

export function FlowsGraph({
  interopChains,
  data,
  width,
  height,
  isSmallScreen,
}: FlowsGraphProps) {
  const { selectedChains } = useInteropFlows()

  const layout = useMemo(
    () =>
      computeGraphLayout(
        selectedChains,
        data.chainData,
        width,
        height,
        isSmallScreen,
      ),
    [selectedChains, data.chainData, width, height, isSmallScreen],
  )

  const maxVolume = Math.max(...data.flows.map((f) => f.volume))

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
    >
      <BackgroundRoads
        chainIds={selectedChains}
        layout={layout}
        centerX={width / 2}
        centerY={height / 2}
      />
      <ParticleLayer
        flows={data.flows}
        layout={layout}
        interopChains={interopChains}
        centerX={width / 2}
        centerY={height / 2}
        maxVolume={maxVolume}
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
