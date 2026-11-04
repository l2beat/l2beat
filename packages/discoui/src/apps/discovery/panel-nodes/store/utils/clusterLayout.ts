import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force'
import type { Node } from '../State'
import type { GraphEdge } from './graphProjection'
import type { NodeLocations } from './storage'
import { topLevelByDescendant } from './subnodes'

// d3 assumes each node is a single point (no width and height),
// so we scale the coordinates of the simulation to move the nodes
// further apart and not overlap
const SIM_SCALE = 10
// d3's default alpha decay reaches alphaMin after 300 ticks, and its timer
// runs one more before it reports the simulation as ended.
const SIMULATION_TICKS = 301

interface SimulationNode extends SimulationNodeDatum {
  id: string
  x: number
  y: number
}

export function clusterLayout(
  baseNodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
): NodeLocations {
  const { left, top } = getAnchorPoints(baseNodes, freshLayout)

  // NaN tells d3 to assign its deterministic phyllotaxis seed. Seeding
  // from current positions makes repeated presses non-idempotent:
  // disconnected components repel each other further on every run.
  const simNodes: SimulationNode[] = baseNodes.map((node) => ({
    id: node.id,
    x: Number.NaN,
    y: Number.NaN,
  }))

  const byDescendant = topLevelByDescendant(baseNodes)
  const simulationIds = new Set(simNodes.map((node) => node.id))
  const links = visibleEdges
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

  forceSimulation(simNodes)
    .stop()
    .force(
      'link',
      forceLink(links).id((d) => (d as SimulationNode).id),
    )
    .force('charge', forceManyBody())
    .force('center', forceCenter(0, 0))
    .tick(SIMULATION_TICKS)

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  for (const simNode of simNodes) {
    minX = Math.min(minX, simNode.x)
    minY = Math.min(minY, simNode.y)
  }

  const nodeLocations: NodeLocations = {}
  for (const simNode of simNodes) {
    nodeLocations[simNode.id] = {
      x: (simNode.x - minX) * SIM_SCALE + left,
      y: (simNode.y - minY) * SIM_SCALE + top,
    }
  }
  return nodeLocations
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
