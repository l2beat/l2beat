import clsx from 'clsx'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { centerLocationsInViewport } from '../store/utils/centerLocationsInViewport'
import {
  type GraphEdge,
  getGraphProjection,
} from '../store/utils/graphProjection'
import { containerBoxes } from '../store/utils/renderGraph'
import type { NodeLocations } from '../store/utils/storage'
import { topLevelByDescendant } from '../store/utils/subnodes'
import { ControlButton } from './ControlButton'
import { IconControlStack } from './icons/IconControlStack'

export function StackLayoutButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const layout = useStore((state) => state.layout)
  const selected = useStore((state) => state.selected)
  const considerAllNodes = selected.length === 0
  const footprints = containerBoxes(nodes)
  const projection = getGraphProjection(nodes)
  const visibleNodes = nodes
    .filter(
      (node) =>
        !projection.hiddenNodeIds.has(node.id) &&
        (considerAllNodes || selected.includes(node.id)),
    )
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })

  return (
    <ControlButton
      onClick={() => {
        let locations = stackAutoLayout(
          visibleNodes,
          considerAllNodes,
          projection.visibleEdges,
        )
        if (considerAllNodes) {
          const { transform, viewportContainer } = useStore.getState()
          locations = centerLocationsInViewport(
            locations,
            visibleNodes,
            transform,
            viewportContainer,
          )
        }
        layout(locations)
      }}
      className={clsx('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlStack />
      </span>
    </ControlButton>
  )
}

const X_SPACING = 200
const Y_SPACING_SM = 20
const Y_SPACING_LG = 60
const Y_SPACING_CLUSTER = 100
const SIMULATION_STEPS = 200

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
  force: number
}

export function stackAutoLayout(
  baseNodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
) {
  const nodes = toLayoutNodes(baseNodes, visibleEdges)
  const clusters = clusterNodes(nodes)

  let { top, left } = getAnchorPoints(baseNodes, freshLayout)
  for (const nodes of clusters) {
    removeSoleParentConnection(nodes)
    markTrees(nodes)
    assignLevels(nodes)
    const columns = groupByLevel(nodes)
    const maxHeight = layoutColumns(columns, left, top)
    top += maxHeight + Y_SPACING_CLUSTER
  }

  for (let i = 0; i < SIMULATION_STEPS; i++) {
    let top = Math.min(...clusters.flat().map((x) => x.y))
    for (const nodes of clusters) {
      const maxY = physicsStep(nodes, top, i)
      top = maxY + Y_SPACING_CLUSTER
    }
  }

  const nodeLocations: NodeLocations = {}
  for (const node of nodes) {
    nodeLocations[node.id] = { x: node.x, y: node.y }
  }
  return nodeLocations
}

function getChain(address: string): string {
  const [prefix] = address.split(':', 1)
  if (prefix === undefined) {
    throw new Error('Invalid address')
  }

  return prefix
}

function toLayoutNodes(
  baseNodes: readonly Node[],
  visibleEdges: readonly GraphEdge[],
) {
  const nodes = baseNodes.map(
    (base): LayoutNode => ({
      id: base.id,
      connectionsIn: [],
      connectionsOut: [],
      base,
      isTree: false,
      level: 0,
      x: 0,
      y: 0,
      height: base.box.height,
      margin: 0,
      force: 0,
    }),
  )

  const byId = new Map(nodes.map((node) => [node.id, node]))
  const topLevelByAddress = topLevelByDescendant(baseNodes)

  for (const edge of visibleEdges) {
    const sourceTop = topLevelByAddress.get(edge.source)
    const targetTop = topLevelByAddress.get(edge.target)
    const source = sourceTop ? byId.get(sourceTop.id) : undefined
    const target = targetTop ? byId.get(targetTop.id) : undefined
    if (source && target && source !== target) {
      if (nodeChain(source.base) === nodeChain(target.base)) {
        if (!source.connectionsOut.includes(target)) {
          source.connectionsOut.push(target)
        }
        if (!target.connectionsIn.includes(source)) {
          target.connectionsIn.push(source)
        }
      }
    }
  }

  return nodes
}

function nodeChain(node: Node): string {
  const first = node.subnodes[0]
  if (first === undefined) {
    return getChain(node.id)
  }
  return nodeChain(first)
}

function clusterNodes(nodes: LayoutNode[]) {
  const visited = new Set<LayoutNode>()

  function addToCluster(cluster: LayoutNode[], node: LayoutNode) {
    if (visited.has(node)) {
      return
    }
    visited.add(node)
    cluster.push(node)
    for (const other of node.connectionsIn) {
      addToCluster(cluster, other)
    }
    for (const other of node.connectionsOut) {
      addToCluster(cluster, other)
    }
  }

  const clusters: LayoutNode[][] = []
  for (const node of nodes) {
    if (visited.has(node)) {
      continue
    }
    const cluster: LayoutNode[] = []
    addToCluster(cluster, node)
    clusters.push(cluster)
  }

  return clusters
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

      const uniqueChildren = node.connectionsOut
        .map((child) => child.id)
        .filter((id) => order.indexOf(id) === -1)
      order.splice(index, 0, ...uniqueChildren)
    }
  }

  nodes.length = 0
  for (const [i, column] of columns.entries()) {
    column.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    for (const node of column) {
      node.level = i + 1
      nodes.push(node)
    }
  }
  return columns
}

function layoutColumns(columns: LayoutNode[][], x = 0, y = 0) {
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
    const minY = column.reduce(
      (a, b) => Math.min(a, b.y),
      Number.POSITIVE_INFINITY,
    )
    for (const node of column) {
      maxColumnHeight = Math.max(maxColumnHeight, node.y + node.height - minY)
    }

    for (const node of column) {
      node.y += (maxHeight - maxColumnHeight) / 2
    }
  }

  return maxHeight
}

function physicsStep(nodes: LayoutNode[], top: number, step: number) {
  for (const node of nodes) {
    const positions: number[] = []
    for (const other of [...node.connectionsIn, ...node.connectionsOut]) {
      if (other.level !== node.level) {
        positions.push(other.y + other.height / 2)
      }
    }
    if (positions.length !== 0) {
      const position = node.y + node.height / 2
      const target = positions.reduce((a, b) => a + b) / positions.length
      const distance = target - position
      node.force = Math.sign(distance) * Math.sqrt(Math.abs(distance))
    }
  }

  for (const node of nodes) {
    node.y += node.force
    node.force = 0
  }

  if (step % 2 === 0) {
    for (let i = 0; i < nodes.length; i++) {
      const previous = nodes[i - 1]
      const current = nodes[i]
      if (previous && current && current.level === previous.level) {
        const bottom = previous.y + previous.height + previous.margin
        if (current.y < bottom) {
          current.y = bottom
        }
      }
    }
  } else {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const next = nodes[i + 1]
      const current = nodes[i]
      if (next && current && current.level === next.level) {
        const top = next.y - current.height - current.margin
        if (current.y > top) {
          current.y = top
        }
      }
    }
  }

  let minY = Number.POSITIVE_INFINITY
  for (const node of nodes) {
    minY = Math.min(node.y, minY)
  }

  let maxY = 0
  for (const node of nodes) {
    node.y -= minY - top
    maxY = Math.max(maxY, node.y + node.height)
  }
  return maxY
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

function getAnchorPoints(
  nodes: readonly Node[],
  freshLayout: boolean,
): { top: number; left: number } {
  if (freshLayout) {
    return { top: 0, left: 0 }
  }

  const top = nodes
    .map((node) => node.box.y)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
  const left = nodes
    .map((node) => node.box.x)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)

  return { top, left }
}
