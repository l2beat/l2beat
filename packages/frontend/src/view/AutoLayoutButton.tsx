import {
  type SimulationLinkDatum,
  type SimulationNodeDatum,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { useEffect, useState } from 'react'

import type { Node } from '../store/State'
import { useStore } from '../store/store'
import type { NodeLocations } from '../store/utils/storageParsing'

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

interface SimulationLink extends SimulationLinkDatum<SimulationNode> {
  source: string
  target: string
}

export function AutoLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)
  const [updatingLayout, setUpdatingLayout] = useState<boolean>(false)

  const draw = () => {
    if (!updatingLayout) return

    const simNodes: SimulationNode[] = nodes.map((node) => ({
      id: node.simpleNode.id,
      x: node.box.x / SIM_SCALE,
      y: node.box.y / SIM_SCALE,
      node,
    }))

    const links = nodes
      .map((n) => n.simpleNode)
      .flatMap((n) =>
        n.fields.map((f) => ({
          source: n.id,
          target: f.connection,
        })),
      )
      .filter((l) => l.target !== undefined)
      .filter(
        (l) => simNodes.find((sn) => sn.id === l.target) !== undefined,
      ) as SimulationLink[]

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
      updateNodeLocations(nodeLocations)
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
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      type="button"
      disabled={updatingLayout}
      onClick={() => setUpdatingLayout(true)}
    >
      {updatingLayout ? 'wait...' : 'Auto-layout'}
    </button>
  )
}
