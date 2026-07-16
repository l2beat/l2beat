import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force'
import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { centerLocationsInViewport } from '../store/utils/centerLocationsInViewport'
import { getGraphProjection } from '../store/utils/graphProjection'
import { containerBoxes } from '../store/utils/renderGraph'
import type { NodeLocations } from '../store/utils/storage'
import { topLevelByDescendant } from '../store/utils/subnodes'
import { ControlButton } from './ControlButton'
import { IconControlCluster } from './icons/IconControlCluster'

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

export function ClusterLayoutButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const selected = useStore((state) => state.selected)
  const footprints = containerBoxes(nodes)
  const projection = getGraphProjection(nodes)
  const visibleNodes = nodes
    .filter((node) => !projection.hiddenNodeIds.has(node.id))
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })
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

    // NaN tells d3 to assign its deterministic phyllotaxis seed. Seeding
    // from current positions makes repeated presses non-idempotent:
    // disconnected components repel each other further on every run.
    const simNodes: SimulationNode[] = simulationNodes.map((node) => ({
      id: node.id,
      x: Number.NaN,
      y: Number.NaN,
      node,
    }))

    const byDescendant = topLevelByDescendant(simulationNodes)

    const simulationIds = new Set(simNodes.map((node) => node.id))
    const links = projection.visibleEdges
      .map((edge) => ({
        source: byDescendant.get(edge.source)?.id ?? edge.source,
        target: byDescendant.get(edge.target)?.id ?? edge.target,
      }))
      .filter(
        (link) =>
          link.source !== link.target &&
          simulationIds.has(link.source) &&
          simulationIds.has(link.target),
      )

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

      simNodes.forEach((simNode) => {
        nodeLocations[simNode.id] = {
          x: (simNode.x - minX) * SIM_SCALE + left,
          y: (simNode.y - minY) * SIM_SCALE + top,
        }
      })
      if (selected.length === 0) {
        const { transform, viewportContainer } = useStore.getState()
        layout(
          centerLocationsInViewport(
            nodeLocations,
            simulationNodes,
            transform,
            viewportContainer,
          ),
        )
      } else {
        layout(nodeLocations)
      }
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
      className={cn('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlCluster />
      </span>
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
