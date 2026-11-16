import { assert } from '@l2beat/shared-pure'
import type { Node, State } from '../State'
import { centerLocationsInViewport } from '../utils/centerLocationsInViewport'
import { flowLayout } from '../utils/flowLayout'
import {
  type GraphProjection,
  getGraphProjection,
  hideItems,
} from '../utils/graphProjection'
import { BELOW_LANES_GAP_PX, laneLayout } from '../utils/laneLayout'
import { containerBoxes } from '../utils/renderGraph'
import type { NodeLocations } from '../utils/storage'
import { topLevelByDescendant } from '../utils/subnodes'
import { updateNodePositions } from '../utils/updateNodePositions'
import { layout, withoutHiddenFields } from './other'

// Lanes top to bottom, columns left to right, contract ids top to bottom.
export type Lanes = readonly (readonly (readonly string[])[])[]

export interface ArrangeRequest {
  readonly lanes: Lanes
  // Shows only what the lanes name, as far as hiding allows.
  readonly hideOthers: boolean
}

// The agent's layout: the lanes in front of the researcher and everything
// else drawn arranged below them, so nothing overlaps. Hiding and moving
// are one step, which one undo takes back.
export function arrange(state: State, request: ArrangeRequest): Partial<State> {
  const shown = request.hideOthers ? showOnlyNamed(state, request.lanes) : state
  return layout(shown, arrangeLocations(shown, request.lanes))
}

// What the node view draws of the lanes: the items placed in them, the
// drawn items they do not name, and the named contracts it does not draw.
export function readArrangement(
  state: State,
  lanes: Lanes,
): { placed: string[]; below: Node[]; notDrawn: string[] } {
  const projection = getGraphProjection(state.nodes)
  const topLevel = topLevelByDescendant(state.nodes)
  const placed = new Set<string>()
  const notDrawn: string[] = []
  for (const id of lanes.flat(2)) {
    const item = drawnItemOf(projection, topLevel, id)
    if (item === undefined) {
      notDrawn.push(id)
      continue
    }
    placed.add(item.id)
  }
  const below = drawnItems(state.nodes, projection).filter(
    (node) => !placed.has(node.id),
  )
  return { placed: [...placed], below, notDrawn }
}

// A group stands for its members, hidden ones too, while it is drawn
// itself; a contract the view lacks has no item.
export function drawnItemOf(
  projection: GraphProjection,
  topLevel: ReadonlyMap<string, Node>,
  id: string,
): Node | undefined {
  const item = topLevel.get(id)
  if (item === undefined) {
    return undefined
  }
  return projection.hiddenNodeIds.has(item.id) ? undefined : item
}

// Top-level items as drawn, an open group as its container's footprint.
export function drawnItems(
  nodes: readonly Node[],
  projection: GraphProjection,
): Node[] {
  const footprints = containerBoxes(nodes)
  return nodes
    .filter((node) => !projection.hiddenNodeIds.has(node.id))
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })
}

// Hiding changes node heights, with fewer rows and a hidden fields footer,
// so this lays the nodes out again before anything measures them.
function showOnlyNamed(state: State, lanes: Lanes): State {
  const nodes = withoutHiddenFields(state.nodes)
  const topLevel = topLevelByDescendant(nodes)
  const named = new Set<string>()
  for (const id of lanes.flat(2)) {
    const item = topLevel.get(id)
    if (item !== undefined) {
      named.add(item.id)
    }
  }
  const others = new Set(
    nodes.filter((node) => !named.has(node.id)).map((node) => node.id),
  )
  return updateNodePositions(state, { nodes: hideItems(nodes, others) })
}

function arrangeLocations(state: State, lanes: Lanes): NodeLocations {
  const projection = getGraphProjection(state.nodes)
  const topLevel = topLevelByDescendant(state.nodes)
  const placedLanes = placeLanes(lanes, (id) =>
    drawnItemOf(projection, topLevel, id),
  )
  const placed = new Set(placedLanes.flat(2))
  const drawn = drawnItems(state.nodes, projection)
  const laneNodes = drawn.filter((node) => placed.has(node.id))
  const others = drawn.filter((node) => !placed.has(node.id))

  const laneLocations = laneLayout(
    placedLanes,
    new Map(laneNodes.map((node) => [node.id, node.box])),
  )
  const belowTop =
    laneNodes.length === 0
      ? 0
      : bottomOf(laneLocations, laneNodes) + BELOW_LANES_GAP_PX
  const belowLocations = moveDown(
    flowLayout(others, true, projection.visibleEdges),
    belowTop,
  )
  return centerLocationsInViewport(
    { ...laneLocations, ...belowLocations },
    laneNodes.length === 0 ? others : laneNodes,
    state.transform,
    state.viewportContainer,
  )
}

// The drawn item of each contract, once, in the first place it is named.
// Columns and lanes left with nothing drawn take no room.
function placeLanes(
  lanes: Lanes,
  itemOf: (id: string) => Node | undefined,
): string[][][] {
  const placed = new Set<string>()
  const placedLanes: string[][][] = []
  for (const lane of lanes) {
    const columns: string[][] = []
    for (const column of lane) {
      const ids: string[] = []
      for (const id of column) {
        const item = itemOf(id)
        if (item === undefined) {
          continue
        }
        if (placed.has(item.id)) {
          continue
        }
        placed.add(item.id)
        ids.push(item.id)
      }
      if (ids.length > 0) {
        columns.push(ids)
      }
    }
    if (columns.length > 0) {
      placedLanes.push(columns)
    }
  }
  return placedLanes
}

function bottomOf(locations: NodeLocations, nodes: readonly Node[]): number {
  let bottom = Number.NEGATIVE_INFINITY
  for (const node of nodes) {
    const location = locations[node.id]
    assert(location !== undefined, 'Lane item without a location')
    bottom = Math.max(bottom, location.y + node.box.height)
  }
  return bottom
}

function moveDown(locations: NodeLocations, distance: number): NodeLocations {
  const moved: NodeLocations = {}
  for (const [id, location] of Object.entries(locations)) {
    moved[id] = { x: location.x, y: location.y + distance }
  }
  return moved
}
