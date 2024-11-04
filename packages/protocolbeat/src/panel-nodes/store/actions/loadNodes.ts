import type { Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { recallNodeLayout } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  const toAdd: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existing: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    return newNode ? { ...newNode, box: node.box, color: node.color } : node
  })
  toAdd.push(...createUnknownNodes([...toAdd, ...existing]))

  const startX =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((node) => node.box.x + node.box.width)) +
        NODE_SPACING

  const saved = recallNodeLayout(projectId)
  let missing = 0
  const added = toAdd.map((node) => {
    const box = saved?.locations[node.id]
    const x = box?.x ?? startX + (NODE_WIDTH + NODE_SPACING) * missing
    missing++
    const y = box?.y ?? 0
    const width = box?.width ?? NODE_WIDTH
    const savedColor = saved?.colors?.[node.id]
    const color = typeof savedColor === 'number' ? savedColor : node.color
    // height will be updated by updatePositions
    return { ...node, color, box: { x, y, width, height: 0 } }
  })

  return updateNodePositions({
    ...state,
    projectId,
    nodes: existing.concat(added),
  })
}

function createUnknownNodes(nodes: Node[]): Node[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((node) => node.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (!knownIds.has(field.target)) {
        unknownIds.add(field.target)
      }
    }
  }

  return [...unknownIds].map(idToUnknown)
}

function idToUnknown(id: string): Node {
  // TODO: better address treatment
  const address = id.split(':')[1] as string
  const name = `Unknown ${address.slice(0, 6)}…${address.slice(-4)}`
  return {
    id,
    address,
    addressType: 'Unknown',
    name,
    box: { x: 0, y: 0, width: 0, height: 0 },
    color: 0,
    fields: [],
    data: null,
  }
}
