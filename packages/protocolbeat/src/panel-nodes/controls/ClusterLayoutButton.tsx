import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
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

export function ClusterLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const selected = useStore((state) => state.selected)
  const visibleNodes = nodes.filter((node) => !hiddenNodes.includes(node.id))
  const simulationNodes =
    selected.length === 0
      ? visibleNodes
      : visibleNodes.filter((node) => selected.includes(node.id))

  const layout = useStore((state) => state.layout)
  const [updatingLayout, setUpdatingLayout] = useState<boolean>(false)

  const draw = () => {
    if (!updatingLayout) return

    const { left, top } = getAnchorPoints(
      simulationNodes,
      selected.length === 0,
    )

    const simNodes: SimulationNode[] = simulationNodes.map((node) => ({
      id: node.id,
      x: node.box.x / SIM_SCALE,
      y: node.box.y / SIM_SCALE,
      node,
    }))

    const links = simulationNodes
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
      .on('end', ended)
      .tick(300) // NOTE(radomski): Manually step the simulation by 300 steps, otherwise by default only a single step is done per animation frame

    function ended() {
      const nodeLocations: NodeLocations = {}
      const { minY, minX } = simNodes.reduce(
        (a, b) => ({
          minY: Math.min(a.minY, b.y),
          minX: Math.min(a.minX, b.x),
        }),
        { minY: Number.POSITIVE_INFINITY, minX: Number.POSITIVE_INFINITY },
      )

      console.log(minX, minY, minX * SIM_SCALE, minY * SIM_SCALE, top, left)

      simNodes.forEach((simNode) => {
        nodeLocations[simNode.id] = {
          x: (simNode.x - minY) * SIM_SCALE + left,
          y: (simNode.y - minX) * SIM_SCALE + top,
        }
      })
      layout(nodeLocations)
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
      {updatingLayout ? 'Wait...' : 'Cluster layout'}
    </ControlButton>
  )
}

function getAnchorPoints(
  nodes: readonly Node[],
  freshLayout: boolean,
): { top: number; left: number } {
  if (freshLayout) {
    return { top: 0, left: 0 }
  }

  const top = nodes
    .map((node) => node.box.y)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
  const left = nodes
    .map((node) => node.box.x)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)

  return { top, left }
}
