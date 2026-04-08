import { useMemo } from 'react'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { BackgroundRoads } from './BackgroundRoads'
import { computeGraphLayout } from './utils/computeGraphLayout'

interface FlowsGraphProps {
  data: InteropFlowsData
  width: number
  height: number
}

export function FlowsGraph({ data, width, height }: FlowsGraphProps) {
  const { selectedChains } = useInteropFlows()

  const layout = useMemo(
    () => computeGraphLayout(selectedChains, data.chainVolumes, width, height),
    [selectedChains, data.chainVolumes, width, height],
  )

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <BackgroundRoads
        chainIds={selectedChains}
        layout={layout}
        centerX={width / 2}
        centerY={height / 2}
        hoveredChainId={null}
      />
    </svg>
  )
}
