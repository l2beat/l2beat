import { assert } from '@l2beat/shared-pure'
import type {
  ApiAgentGraph,
  ApiAgentGraphItem,
  ApiAgentNodeViewNotLoaded,
} from '../../../api/types'
import { drawnItems } from '../panel-nodes/store/actions/arrange'
import type { Node, State } from '../panel-nodes/store/State'
import {
  type GraphProjection,
  getGraphProjection,
} from '../panel-nodes/store/utils/graphProjection'
import { topLevelByDescendant } from '../panel-nodes/store/utils/subnodes'

// The server refuses longer names, and a group's name is the researcher's
// own text.
const NAME_LENGTH_MAX = 200

export function isDrawing(state: State, project: string): boolean {
  return state.loaded && state.projectId === project
}

export function notLoaded(state: State): ApiAgentNodeViewNotLoaded {
  return state.loaded
    ? { status: 'not-loaded', project: state.projectId }
    : { status: 'not-loaded' }
}

// The node view as drawn, in ids and canvas pixels: the server reads the
// contracts' names from disk itself, and only a group's name is the tab's.
export function readGraph(state: State, project: string): ApiAgentGraph {
  if (!isDrawing(state, project)) {
    return notLoaded(state)
  }
  const projection = getGraphProjection(state.nodes)
  const items = drawnItems(state.nodes, projection)
  return {
    status: 'loaded',
    items: items.map((item) => toGraphItem(item, projection)),
    links: readLinks(state.nodes, projection, items),
    hidden: projection.leafNodes
      .filter((node) => projection.hiddenNodeIds.has(node.id))
      .map((node) => ({ id: node.id, name: cutName(node.name) })),
  }
}

function toGraphItem(
  item: Node,
  projection: GraphProjection,
): ApiAgentGraphItem {
  const box = {
    id: item.id,
    name: cutName(item.name),
    x: item.box.x,
    y: item.box.y,
    width: item.box.width,
    height: item.box.height,
  }
  if (item.subnodes.length === 0) {
    return box
  }
  return {
    ...box,
    members: [...(projection.leafIdsByItemId.get(item.id) ?? [])],
  }
}

// Links between drawn items, one per field: a group's members' fields leave
// the group, and a link inside one item is not drawn between items.
function readLinks(
  nodes: readonly Node[],
  projection: GraphProjection,
  items: readonly Node[],
): [number, number, string][] {
  const topLevel = topLevelByDescendant(nodes)
  const indexById = new Map(items.map((item, index) => [item.id, index]))
  const links: [number, number, string][] = []
  const seen = new Set<string>()
  for (const edge of projection.visibleEdges) {
    const source = indexOf(indexById, topLevel, edge.source)
    const target = indexOf(indexById, topLevel, edge.target)
    if (source === target) {
      continue
    }
    const key = JSON.stringify([source, target, edge.fieldName])
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    links.push([source, target, edge.fieldName])
  }
  return links
}

// A visible edge joins visible contracts, which drawn items hold.
function indexOf(
  indexById: ReadonlyMap<string, number>,
  topLevel: ReadonlyMap<string, Node>,
  id: string,
): number {
  const item = topLevel.get(id)
  assert(item !== undefined, 'Edge end outside the graph')
  const index = indexById.get(item.id)
  assert(index !== undefined, 'Edge end not drawn')
  return index
}

export function cutName(name: string): string {
  return name.slice(0, NAME_LENGTH_MAX)
}
