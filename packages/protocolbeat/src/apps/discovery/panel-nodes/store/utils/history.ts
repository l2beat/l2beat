import type { HistorySnapshot, HistoryState, Node, State } from '../State'
import { updateNodePositions } from './updateNodePositions'

const HISTORY_LIMIT = 50

export function emptyHistoryState(): HistoryState {
  return {
    past: [],
    future: [],
  }
}

export function captureHistorySnapshot(
  state: Pick<State, 'nodes'>,
): HistorySnapshot {
  return {
    nodes: state.nodes,
  }
}

export function snapshotsEqual(
  left: HistorySnapshot,
  right: HistorySnapshot,
): boolean {
  if (left.nodes.length !== right.nodes.length) {
    return false
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
  const nodeIds = new Set(snapshot.nodes.map((node) => node.id))
  const selected = state.selected.filter((id) => nodeIds.has(id))

  return updateNodePositions(state, {
    nodes: [...snapshot.nodes],
    selected,
    resizingNode: undefined,
    mouseUpAction: undefined,
    mouseMoveAction: undefined,
    selection: undefined,
    positionsBeforeMove: {},
  })
}

function snapshotNodesEqual(left: Node, right: Node): boolean {
  if (
    left.id !== right.id ||
    left.name !== right.name ||
    left.color !== right.color ||
    left.box.x !== right.box.x ||
    left.box.y !== right.box.y ||
    left.box.width !== right.box.width ||
    left.box.height !== right.box.height ||
    !arraysEqual(left.hiddenFields, right.hiddenFields) ||
    left.subnodes.length !== right.subnodes.length
  ) {
    return false
  }
  // Members of opened groups live nested, so a member drag only shows up here.
  for (let index = 0; index < left.subnodes.length; index++) {
    const leftSubnode = left.subnodes[index]
    const rightSubnode = right.subnodes[index]
    if (
      !leftSubnode ||
      !rightSubnode ||
      !snapshotNodesEqual(leftSubnode, rightSubnode)
    ) {
      return false
    }
  }
  return true
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
