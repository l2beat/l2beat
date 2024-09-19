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
  x: number
  y: number
  height: number
  margin: number
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
  const { nodeLocations } = layoutColumns(columns)
  return nodeLocations
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
      x: 0,
      y: 0,
      height: base.box.height,
      margin: 0,
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
  // first pass - everyone gets a level, left-heavy
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

  function adjustTreeLevel(node: LayoutNode) {
    node.level = Math.max(...node.connectionsIn.map((x) => x.level + 1), 0)
    for (const child of node.connectionsOut) {
      adjustTreeLevel(child)
    }
  }

  // second pass, pushes nodes right, closer to children
  while (true) {
    let changed = false
    for (const node of nodes) {
      if (node.connectionsOut.length === 0) {
        continue
      }

      const treeLevels = node.connectionsOut
        .filter((x) => x.isTree && x.connectionsIn.length === 1)
        .map((x) => x.level)
      const maxTreeLevel = Math.max(...treeLevels)
      const nonTreeLevels = node.connectionsOut
        .filter((x) => !x.isTree)
        .map((x) => x.level)
      const minNonTreeLevel = Math.min(...nonTreeLevels)

      let newLevel = node.level

      if (nonTreeLevels.length > 0 && node.level < minNonTreeLevel - 1) {
        newLevel = minNonTreeLevel - 1
      } else if (treeLevels.length > 0 && node.level < maxTreeLevel - 1) {
        newLevel = maxTreeLevel - 1
      }

      if (newLevel !== node.level) {
        node.level = newLevel
        changed = true
        for (const child of node.connectionsOut) {
          if (child.isTree) {
            adjustTreeLevel(child)
          }
        }
      }
    }

    if (!changed) {
      break
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
      let index = order.indexOf(node.id)
      if (index === -1) {
        index = order.push(node.id) - 1
      }

      const uniqueChildren = node.base.simpleNode.fields
        .flatMap((f) => (f.connection ? [f.connection] : []))
        .filter((id) => order.indexOf(id) === -1)
      order.splice(index, 0, ...uniqueChildren)
    }
  }

  for (const column of columns) {
    column.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }
  return columns
}

function layoutColumns(columns: LayoutNode[][], x = 0, y = 0) {
  const X_SPACING = 200
  const Y_SPACING_SM = 20
  const Y_SPACING_LG = 60

  const nodeLocations: NodeLocations = {}
  let xOffset = x
  let maxHeight = 0
  for (const column of columns) {
    let yOffset = y
    let maxWidth = 0

    for (const [i, node] of column.entries()) {
      node.x = xOffset
      node.y = yOffset

      yOffset += node.base.box.height
      maxHeight = Math.max(maxHeight, yOffset)
      const next = column[i + 1]
      if (next && equalMembers(node.connectionsIn, next.connectionsIn)) {
        yOffset += Y_SPACING_SM
        node.margin = Y_SPACING_SM
      } else {
        yOffset += Y_SPACING_LG
        node.margin = Y_SPACING_LG
      }
      maxWidth = Math.max(maxWidth, node.base.box.width)
    }
    xOffset += maxWidth + X_SPACING
  }

  for (const column of columns) {
    let maxColumnHeight = 0
    for (const node of column) {
      maxColumnHeight = Math.max(maxColumnHeight, node.y + node.height)
    }

    for (const node of column) {
      node.y += (maxHeight - maxColumnHeight) / 2
      nodeLocations[node.id] = { x: node.x, y: node.y }
    }
  }

  return {
    nodeLocations,
    width: xOffset - X_SPACING,
    height: maxHeight,
  }
}

function equalMembers<T>(a: T[], b: T[]) {
  if (a.length !== b.length) {
    return false
  }
  const aSet = new Set(a)
  for (const item of b) {
    if (!aSet.has(item)) {
      return false
    }
  }
  return true
}
