import type { Box, Field, Node } from '../panel-nodes/store/State'
import { layoutFields } from '../panel-nodes/store/utils/renderGraph'
import { getNodeHeight } from '../panel-nodes/store/utils/updateNodePositions'

// Wider than in the graph: the answer has room, and names should not be cut.
const NODE_WIDTH = 260
const NODE_GAP = 48
const LANE_GAP = 72
const MARGIN = 32
const FIELDS_PER_TARGET_MAX = 3

export type PathOrientation = 'vertical' | 'horizontal'

export interface PathLayout {
  nodes: Node[]
  width: number
  height: number
  orientation: PathOrientation
}

// Which fields a node keeps: the links the agent's answer is made of.
export type KeepLink = (from: string, to: string) => boolean

// The agent's answer drawn on its own: every path is a lane read from holder
// to target, with only the fields that make up the answer, so it stays
// legible however far apart the contracts sit in the saved layout.
export function layoutAgentPaths(
  lanes: readonly (readonly string[])[],
  nodeById: ReadonlyMap<string, Node>,
  keep: KeepLink,
  viewport: { width: number; height: number },
): PathLayout {
  const vertical = place(lanes, nodeById, keep, 'vertical')
  const horizontal = place(lanes, nodeById, keep, 'horizontal')
  return fitScale(vertical, viewport) >= fitScale(horizontal, viewport)
    ? vertical
    : horizontal
}

export function fitScale(
  layout: Pick<PathLayout, 'width' | 'height'>,
  viewport: { width: number; height: number },
): number {
  if (layout.width === 0 || layout.height === 0) {
    return 1
  }
  return Math.min(
    1,
    viewport.width / layout.width,
    viewport.height / layout.height,
  )
}

function place(
  lanes: readonly (readonly string[])[],
  nodeById: ReadonlyMap<string, Node>,
  keep: KeepLink,
  orientation: PathOrientation,
): PathLayout {
  const placed: Node[] = []
  const placedIds = new Set<string>()
  // Lanes stack across the flow; each one starts where the previous ended.
  let laneStart = MARGIN
  let flowEnd = MARGIN
  for (const lane of lanes) {
    let flow = MARGIN
    let laneSize = 0
    for (const id of lane) {
      const node = nodeById.get(id)
      if (node === undefined || placedIds.has(id)) {
        continue
      }
      const prepared = prepare(node, keep)
      const height = getNodeHeight(prepared)
      const box: Box =
        orientation === 'vertical'
          ? { x: laneStart, y: flow, width: NODE_WIDTH, height }
          : { x: flow, y: laneStart, width: NODE_WIDTH, height }
      placed.push({ ...prepared, box })
      placedIds.add(id)
      const along = orientation === 'vertical' ? height : NODE_WIDTH
      const across = orientation === 'vertical' ? NODE_WIDTH : height
      flow += along + NODE_GAP
      laneSize = Math.max(laneSize, across)
    }
    if (laneSize > 0) {
      laneStart += laneSize + LANE_GAP
      flowEnd = Math.max(flowEnd, flow - NODE_GAP)
    }
  }

  const boxById = new Map(placed.map((node) => [node.id, node.box]))
  const nodes = placed.map((node) => layoutFields(node, boxById))
  const laneEnd = placed.length > 0 ? laneStart - LANE_GAP : MARGIN
  const along = flowEnd + MARGIN
  const across = laneEnd + MARGIN
  return orientation === 'vertical'
    ? { nodes, width: across, height: along, orientation }
    : { nodes, width: along, height: across, orientation }
}

// Keeps at most a few fields per kept link, preferring what the researcher
// left visible in the full graph: timelocks hold hundreds of scheduled calls
// to the same contracts.
function prepare(node: Node, keep: KeepLink): Node {
  const hiddenInGraph = new Set(node.hiddenFields)
  const byTarget = new Map<string, Field[]>()
  for (const field of node.fields) {
    if (keep(node.id, field.target)) {
      const fields = byTarget.get(field.target) ?? []
      fields.push(field)
      byTarget.set(field.target, fields)
    }
  }
  const kept = new Set<Field>()
  for (const fields of byTarget.values()) {
    const visible = fields.filter((field) => !hiddenInGraph.has(field.name))
    const candidates = visible.length > 0 ? visible : fields
    for (const field of candidates.slice(0, FIELDS_PER_TARGET_MAX)) {
      kept.add(field)
    }
  }
  return {
    ...node,
    fields: node.fields.filter((field) => kept.has(field)),
    hiddenFields: [],
    compressedRows: [],
    opened: false,
    subnodes: [],
  }
}
