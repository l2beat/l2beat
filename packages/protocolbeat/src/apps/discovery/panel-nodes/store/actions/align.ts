import type { Node, State } from '../State'
import { updateNodePositions } from '../utils/updateNodePositions'

export type AlignDirection = 'left' | 'right' | 'top' | 'bottom'
export type DistributeAxis = 'horizontal' | 'vertical'

type Axis = 'x' | 'y'

// Single source of truth for how each direction maps onto an axis and whether
// it snaps to the far edge (right/bottom) or the near edge (left/top).
const ALIGNMENT: Record<AlignDirection, { axis: Axis; far: boolean }> = {
  left: { axis: 'x', far: false },
  right: { axis: 'x', far: true },
  top: { axis: 'y', far: false },
  bottom: { axis: 'y', far: true },
}

const SIZE: Record<Axis, 'width' | 'height'> = { x: 'width', y: 'height' }

// Snap the selected nodes to a shared edge (the outermost edge in the chosen
// direction), mirroring how Excalidraw aligns a selection.
export function alignSelected(
  state: State,
  direction: AlignDirection,
): Partial<State> {
  const selectedIds = new Set(state.selected)
  const selectedNodes = state.nodes.filter((node) => selectedIds.has(node.id))
  if (selectedNodes.length < 2) {
    return {}
  }

  const { axis, far } = ALIGNMENT[direction]
  const size = SIZE[axis]
  const edges = selectedNodes.map(
    (node) => node.box[axis] + (far ? node.box[size] : 0),
  )
  const edge = far ? Math.max(...edges) : Math.min(...edges)

  const movedNodes = state.nodes.map((node) => {
    if (!selectedIds.has(node.id)) {
      return node
    }
    const start = far ? edge - node.box[size] : edge
    return { ...node, box: { ...node.box, [axis]: start } }
  })

  return updateNodePositions(state, { nodes: movedNodes })
}

// Even out the gaps between the selected nodes along one axis. The two
// outermost nodes stay put and everything in between is respaced.
export function distributeSelected(
  state: State,
  axis: DistributeAxis,
): Partial<State> {
  const selectedIds = new Set(state.selected)
  const selectedNodes = state.nodes.filter((node) => selectedIds.has(node.id))
  if (selectedNodes.length < 3) {
    return {}
  }

  const resolvedAxis: Axis = axis === 'horizontal' ? 'x' : 'y'
  const starts = evenlySpacedStarts(selectedNodes, resolvedAxis)
  const movedNodes = state.nodes.map((node) => {
    const start = starts.get(node.id)
    return start === undefined
      ? node
      : { ...node, box: { ...node.box, [resolvedAxis]: start } }
  })

  return updateNodePositions(state, { nodes: movedNodes })
}

function evenlySpacedStarts(nodes: Node[], axis: Axis): Map<string, number> {
  const size = SIZE[axis]
  const sorted = [...nodes].sort((a, b) => a.box[axis] - b.box[axis])
  const minStart = Math.min(...sorted.map((node) => node.box[axis]))
  const maxEnd = Math.max(
    ...sorted.map((node) => node.box[axis] + node.box[size]),
  )
  const totalSize = sorted.reduce((sum, node) => sum + node.box[size], 0)
  const gap = (maxEnd - minStart - totalSize) / (sorted.length - 1)

  const starts = new Map<string, number>()
  let cursor = minStart
  for (const node of sorted) {
    starts.set(node.id, cursor)
    cursor += node.box[size] + gap
  }
  return starts
}
