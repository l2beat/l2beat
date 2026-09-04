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
    const from = layout.boxes.get(edge.from)
    const to = layout.boxes.get(edge.to)
    if (!from || !to) continue

    const startX = from.x + from.width / 2
    const startY = from.y + from.height
    const endX = to.x + to.width * (ports.get(edgeKey(edge)) ?? 0.5)
    const endY = to.y
    const busY = endY - BUS_OFFSET

    if (layout.rowOf.get(edge.to) === (layout.rowOf.get(edge.from) ?? 0) + 1) {
      result.set(edgeKey(edge), {
        path: `M ${startX} ${startY} V ${busY} H ${endX} V ${endY}`,
        midX: endX,
        midY: busY,
      })
      continue
    }

    const lane = lanes.get(edge.from) ?? { side: 'left', index: 0 }
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
    incoming.set(edge.to, [...(incoming.get(edge.to) ?? []), edge])
  }
  const result = new Map<string, number>()
  for (const group of incoming.values()) {
    const ordered = group.toSorted(
      (a, b) =>
        (boxes.get(a.from)?.x ?? 0) - (boxes.get(b.from)?.x ?? 0) ||
        a.from.localeCompare(b.from),
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
    [...new Set(edges.map((edge) => edge.from))].toSorted().map((id) => {
      const box = boxes.get(id)
      const centerX = box ? box.x + box.width / 2 : 0
      const side = centerX <= worldWidth / 2 ? 'left' : 'right'
      return [id, { side, index: count[side]++ }]
    }),
  )
}
