import type { Node } from '../store/State'
import { useStore } from '../store/store'
import type { NodeLocations } from '../store/utils/storageParsing'

export function AutoLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)

  function handleAutoLayout() {
    updateNodeLocations(autoLayout(nodes))
  }

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      type="button"
      onClick={handleAutoLayout}
    >
      Auto-layout
    </button>
  )
}

interface LayoutNode {
  id: string
  connectionsIn: LayoutNode[]
  connectionsOut: LayoutNode[]
  base: Node
  level: number
  isTree: boolean
}

function autoLayout(baseNodes: readonly Node[]) {
  if (baseNodes.length === 0) {
    return {}
  }
  const nodes = toLayoutNodes(baseNodes)
  removeSoleParentConnection(nodes)
  markTrees(nodes)
  assignLevels(nodes)
  const columns = groupByLevel(nodes)
  return layoutColumns(columns)
}

function toLayoutNodes(baseNodes: readonly Node[]) {
  const nodes = baseNodes.map(
    (base): LayoutNode => ({
      id: base.simpleNode.id,
      connectionsIn: [],
      connectionsOut: [],
      base,
      isTree: false,
      level: 0,
    }),
  )

  const byId = new Map(nodes.map((x) => [x.id, x]))

  for (const node of nodes) {
    for (const field of node.base.fields) {
      const id = field.connection?.nodeId
      const other = id && byId.get(id)
      if (other && other !== node) {
        if (!node.connectionsOut.includes(other)) {
          node.connectionsOut.push(other)
        }
        if (!other.connectionsIn.includes(node)) {
          other.connectionsIn.push(node)
        }
      }
    }
  }

  return nodes
}

function removeSoleParentConnection(nodes: LayoutNode[]) {
  for (const node of nodes) {
    if (
      node.connectionsIn.length === 1 &&
      node.connectionsOut.length > 1 &&
      node.connectionsIn.every((x) => node.connectionsOut.includes(x))
    ) {
      // This node is a child that knows about it's parent. Common pattern,
      // but we remove the sole connection to parent to simplify the logic
      node.connectionsOut = node.connectionsOut.filter(
        (x) => !node.connectionsIn.includes(x),
      )
    }
  }
}

function markTrees(nodes: LayoutNode[]) {
  while (true) {
    let changed = false
    for (const node of nodes) {
      if (!node.isTree && node.connectionsOut.every((x) => x.isTree)) {
        node.isTree = true
        changed = true
      }
    }
    if (!changed) {
      break
    }
  }
}

function assignLevels(nodes: LayoutNode[]) {
  while (true) {
    let changed = false
    for (const node of nodes) {
      if (node.level !== 0) {
        continue
      }

      if (node.connectionsIn.every((x) => x.level !== 0)) {
        node.level = Math.max(1, ...node.connectionsIn.map((x) => x.level + 1))
        changed = true
        continue
      }
    }

    if (!changed) {
      let candidates = nodes.filter((x) => x.level === 0 && !x.isTree)
      if (candidates.length === 0) {
        candidates = nodes.filter((x) => x.level === 0)
      }
      const zero = candidates.sort(
        (a, b) => b.connectionsOut.length - a.connectionsOut.length,
      )[0]
      if (!zero) {
        break
      }
      zero.level = Math.max(1, ...zero.connectionsIn.map((x) => x.level + 1))
    }
  }
}

function groupByLevel(nodes: LayoutNode[]) {
  const maxLevel = Math.max(...nodes.map((x) => x.level))

  const columns: LayoutNode[][] = Array.from({ length: maxLevel })
    .map((_, i) => nodes.filter((x) => x.level === i + 1))
    .filter((x) => x.length !== 0)

  const order: string[] = columns[0]?.map((x) => x.id) ?? []
  for (const column of columns) {
    for (const node of column) {
      const index = order.indexOf(node.id)
      const uniqueChildren = node.connectionsOut
        .map((x) => x.id)
        .filter((id) => order.indexOf(id) === -1)
      order.splice(index, 0, ...uniqueChildren)
    }
  }

  for (const column of columns) {
    column.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }
  return columns
}

function layoutColumns(columns: LayoutNode[][]) {
  const X_SPACING = 200
  const Y_SPACING = 50

  const nodeLocations: NodeLocations = {}
  let xOffset = 0
  for (const column of columns) {
    let yOffset = 0
    let maxWidth = 0

    for (const node of column) {
      nodeLocations[node.id] = {
        x: xOffset,
        y: yOffset,
      }

      yOffset += node.base.box.height + Y_SPACING
      maxWidth = Math.max(node.base.box.width, maxWidth)
    }

    yOffset = -yOffset / 2
    for (const node of column) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      nodeLocations[node.id]!.y += yOffset
    }

    xOffset += maxWidth + X_SPACING
  }

  return nodeLocations
}
