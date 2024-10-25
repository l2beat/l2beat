import {
  type SimulationNodeDatum,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { useEffect, useState } from 'react'

import type { Node } from '../store/State'
import { useStore } from '../store/store'
import type { NodeLocations } from '../store/utils/storage'
import { ControlButton } from './ControlButton'

// d3 assumes each node is a single point (no width and height),
// so we scale the coordinates of the simulation to move the nodes
// further apart and not overlap
const SIM_SCALE = 10

interface SimulationNode extends SimulationNodeDatum {
  id: string
  x: number
  y: number
  node: Node
}

export function SlowLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const layout = useStore((state) => state.layout)
  const [updatingLayout, setUpdatingLayout] = useState<boolean>(false)

  const draw = () => {
    if (!updatingLayout) return

    const simNodes: SimulationNode[] = nodes.map((node) => ({
      id: node.id,
      x: node.box.x / SIM_SCALE,
      y: node.box.y / SIM_SCALE,
      node,
    }))

    const links = nodes
      .flatMap((node) =>
        node.fields.map((field) => ({
          source: node.id,
          target: field.target,
        })),
      )
      .filter((l) => simNodes.some((sn) => sn.id === l.target))

    const simulation = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(links).id((d) => (d as SimulationNode).id),
      )
      .force('charge', forceManyBody())
      .force('center', forceCenter(0, 0))
      .on('tick', ticked)
      .on('end', ended)

    function ticked() {
      const nodeLocations: NodeLocations = {}
      simNodes.forEach((simNode) => {
        nodeLocations[simNode.id] = {
          x: simNode.x * SIM_SCALE,
          y: simNode.y * SIM_SCALE,
        }
      })
      layout(nodeLocations)
    }

    function ended() {
      simulation.stop()
      setUpdatingLayout(false)
    }
  }

  useEffect(() => {
    draw()
  }, [updatingLayout])

  return (
    <ControlButton
      disabled={updatingLayout}
      onClick={() => setUpdatingLayout(true)}
    >
      {updatingLayout ? 'Wait...' : 'Slow layout'}
    </ControlButton>
  )
}
