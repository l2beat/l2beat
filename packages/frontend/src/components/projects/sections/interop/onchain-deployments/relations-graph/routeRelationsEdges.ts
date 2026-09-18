import { edgeKey } from './graphSelectors'
import type {
  LayoutEdge,
  NodeBox,
  RelationsLayout,
} from './layoutRelationsGraph'

export interface EdgePath {
  path: string
  /** Where the edge meets the bus above its target; used to anchor labels. */
  midX: number
  midY: number
}

export function isAdjacentRow(backerRow: number, backedRow: number): boolean {
  return backedRow === backerRow + 1
}

const BUS_OFFSET = 44
const LANE_MARGIN = 22
const LANE_STEP = 6
const DEPARTURE = 28

/**
 * Orthogonal paths from a backer's bottom to a bus above its target. Edges
 * that skip a row would cross the cards in between, so they travel down a side
 * lane instead.
 */
export function routeRelationsEdges(
  edges: LayoutEdge[],
  layout: RelationsLayout,
): Map<string, EdgePath> {
  const ports = getTargetPorts(edges, layout.boxes)
  const lanes = getSourceLanes(edges, layout.boxes, layout.width)

  const result = new Map<string, EdgePath>()
  for (const edge of edges) {
    const backer = layout.boxes.get(edge.backer)
    const backed = layout.boxes.get(edge.backed)
    if (!backer || !backed) continue

    const startX = backer.x + backer.width / 2
    const startY = backer.y + backer.height
    const endX = backed.x + backed.width * (ports.get(edgeKey(edge)) ?? 0.5)
    const endY = backed.y
    const busY = endY - BUS_OFFSET

    if (
      isAdjacentRow(
        layout.rowOf.get(edge.backer) ?? 0,
        layout.rowOf.get(edge.backed) ?? 0,
      )
    ) {
      result.set(edgeKey(edge), {
        path: `M ${startX} ${startY} V ${busY} H ${endX} V ${endY}`,
        midX: endX,
        midY: busY,
      })
      continue
    }

    const lane = lanes.get(edge.backer) ?? { side: 'left', index: 0 }
    const laneX =
      lane.side === 'left'
        ? LANE_MARGIN + lane.index * LANE_STEP
        : layout.width - LANE_MARGIN - lane.index * LANE_STEP
    const departureY = startY + Math.min(DEPARTURE, (busY - startY) / 2)
    result.set(edgeKey(edge), {
      path: `M ${startX} ${startY} V ${departureY} H ${laneX} V ${busY} H ${endX} V ${endY}`,
      midX: endX,
      midY: busY,
    })
  }
  return result
}

/** Incoming edges land on distinct fractions of the target's top edge, ordered by source x. */
function getTargetPorts(
  edges: LayoutEdge[],
  boxes: ReadonlyMap<string, NodeBox>,
): Map<string, number> {
  const incoming = new Map<string, LayoutEdge[]>()
  for (const edge of edges) {
    incoming.set(edge.backed, [...(incoming.get(edge.backed) ?? []), edge])
  }
  const result = new Map<string, number>()
  for (const group of incoming.values()) {
    const ordered = group.toSorted(
      (a, b) =>
        (boxes.get(a.backer)?.x ?? 0) - (boxes.get(b.backer)?.x ?? 0) ||
        a.backer.localeCompare(b.backer),
    )
    ordered.forEach((edge, index) =>
      result.set(edgeKey(edge), (index + 1) / (ordered.length + 1)),
    )
  }
  return result
}

function getSourceLanes(
  edges: LayoutEdge[],
  boxes: ReadonlyMap<string, NodeBox>,
  worldWidth: number,
): Map<string, { side: 'left' | 'right'; index: number }> {
  const count = { left: 0, right: 0 }
  return new Map(
    [...new Set(edges.map((edge) => edge.backer))].toSorted().map((id) => {
      const box = boxes.get(id)
      const centerX = box ? box.x + box.width / 2 : 0
      const side = centerX <= worldWidth / 2 ? 'left' : 'right'
      return [id, { side, index: count[side]++ }]
    }),
  )
}
