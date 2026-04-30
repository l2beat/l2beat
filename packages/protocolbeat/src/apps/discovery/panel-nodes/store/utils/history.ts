import type {
  HistorySnapshot,
  HistorySnapshotNode,
  HistoryState,
  State,
} from '../State'
import { updateNodePositions } from './updateNodePositions'

const HISTORY_LIMIT = 50

export function emptyHistoryState(): HistoryState {
  return {
    past: [],
    future: [],
  }
}

export function captureHistorySnapshot(
  state: Pick<State, 'nodes' | 'hidden'>,
): HistorySnapshot {
  return {
    nodes: state.nodes.map((node) => captureHistorySnapshotNode(node)),
    hidden: [...state.hidden],
  }
}

export function snapshotsEqual(
  left: HistorySnapshot,
  right: HistorySnapshot,
): boolean {
  if (left.hidden.length !== right.hidden.length) {
    return false
  }
  if (left.nodes.length !== right.nodes.length) {
    return false
  }

  for (let index = 0; index < left.hidden.length; index++) {
    if (left.hidden[index] !== right.hidden[index]) {
      return false
    }
  }

  for (let index = 0; index < left.nodes.length; index++) {
    const leftNode = left.nodes[index]
    const rightNode = right.nodes[index]
    if (!leftNode || !rightNode || !snapshotNodesEqual(leftNode, rightNode)) {
      return false
    }
  }

  return true
}

export function pushHistorySnapshot(
  history: HistoryState,
  snapshot: HistorySnapshot,
): HistoryState {
  return {
    past: appendPastSnapshot(history.past, snapshot),
    future: [],
  }
}

export function appendPastSnapshot(
  past: readonly HistorySnapshot[],
  snapshot: HistorySnapshot,
): readonly HistorySnapshot[] {
  const next = [...past, snapshot]
  return next.length <= HISTORY_LIMIT ? next : next.slice(-HISTORY_LIMIT)
}

export function applyHistorySnapshot(
  state: State,
  snapshot: HistorySnapshot,
): State {
  const snapshotsByNodeId = new Map(
    snapshot.nodes.map((node) => [node.id, node]),
  )

  const nodes = state.nodes.map((node) => {
    const saved = snapshotsByNodeId.get(node.id)
    if (!saved) {
      return node
    }

    return {
      ...node,
      box: { ...saved.box },
      color: saved.color,
      hiddenFields: [...saved.hiddenFields],
    }
  })

  const nodeIds = new Set(nodes.map((node) => node.id))
  const hidden = snapshot.hidden.filter((id) => nodeIds.has(id))
  const hiddenSet = new Set(hidden)
  const selected = state.selected.filter(
    (id) => nodeIds.has(id) && !hiddenSet.has(id),
  )

  return updateNodePositions({
    ...state,
    nodes,
    hidden,
    selected,
    resizingNode: undefined,
    mouseUpAction: undefined,
    mouseMoveAction: undefined,
    selection: undefined,
    positionsBeforeMove: {},
  })
}

function captureHistorySnapshotNode(
  state: State['nodes'][number],
): HistorySnapshotNode {
  return {
    id: state.id,
    box: { ...state.box },
    color: state.color,
    hiddenFields: [...state.hiddenFields],
  }
}

function snapshotNodesEqual(
  left: HistorySnapshotNode,
  right: HistorySnapshotNode,
): boolean {
  return (
    left.id === right.id &&
    left.color === right.color &&
    left.box.x === right.box.x &&
    left.box.y === right.box.y &&
    left.box.width === right.box.width &&
    left.box.height === right.box.height &&
    arraysEqual(left.hiddenFields, right.hiddenFields)
  )
}

function arraysEqual(
  left: readonly string[],
  right: readonly string[],
): boolean {
  if (left.length !== right.length) {
    return false
  }

  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return false
    }
  }

  return true
}
