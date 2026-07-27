import * as d3 from 'd3'

const CLUSTER_PADDING = 60
const SIMULATION_TICKS = 300

export interface LayoutNode extends d3.SimulationNodeDatum {
  id: string
}

export interface LayoutLink<Node extends LayoutNode>
  extends d3.SimulationLinkDatum<Node> {
  source: Node
  target: Node
}

interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface GraphCluster<
  Node extends LayoutNode,
  Link extends LayoutLink<Node>,
> {
  nodes: Node[]
  links: Link[]
}

export interface GraphLayout<
  Node extends LayoutNode,
  Link extends LayoutLink<Node>,
> {
  clusters: GraphCluster<Node, Link>[]
  width: number
  height: number
}

export function layoutRelationGraph<
  Node extends LayoutNode,
  Link extends LayoutLink<Node>,
>(nodes: Node[], links: Link[]): GraphLayout<Node, Link> {
  const clusters = buildClusters(nodes, links)
  for (const cluster of clusters) {
    layoutCluster(cluster)
  }

  const columns = Math.ceil(Math.sqrt(clusters.length))
  const rows = Math.ceil(clusters.length / columns)
  const bounds = clusters.map((cluster) => getClusterBounds(cluster.nodes))
  const columnWidths = Array.from({ length: columns }, () => 0)
  const rowHeights = Array.from({ length: rows }, () => 0)

  for (const [index, clusterBounds] of bounds.entries()) {
    const column = index % columns
    const row = Math.floor(index / columns)
    columnWidths[column] = Math.max(
      getItem(columnWidths, column),
      width(clusterBounds),
    )
    rowHeights[row] = Math.max(getItem(rowHeights, row), height(clusterBounds))
  }

  const columnOffsets = cumulativeOffsets(columnWidths)
  const rowOffsets = cumulativeOffsets(rowHeights)

  for (const [index, cluster] of clusters.entries()) {
    const column = index % columns
    const row = Math.floor(index / columns)
    const clusterBounds = getItem(bounds, index)
    const targetX =
      getItem(columnOffsets, column) + getItem(columnWidths, column) / 2
    const targetY = getItem(rowOffsets, row) + getItem(rowHeights, row) / 2
    const currentX = (clusterBounds.minX + clusterBounds.maxX) / 2
    const currentY = (clusterBounds.minY + clusterBounds.maxY) / 2
    translateCluster(cluster.nodes, targetX - currentX, targetY - currentY)
  }

  return {
    clusters,
    width: columnWidths.reduce((sum, value) => sum + value, 0),
    height: rowHeights.reduce((sum, value) => sum + value, 0),
  }
}

function buildClusters<Node extends LayoutNode, Link extends LayoutLink<Node>>(
  nodes: Node[],
  links: Link[],
): GraphCluster<Node, Link>[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const neighbors = new Map(
    nodes.map((node) => [node.id, new Set<string>()] as const),
  )

  for (const link of links) {
    getNeighbors(neighbors, link.source.id).add(link.target.id)
    getNeighbors(neighbors, link.target.id).add(link.source.id)
  }

  const visited = new Set<string>()
  const clusters: GraphCluster<Node, Link>[] = []
  const clusterByNodeId = new Map<string, GraphCluster<Node, Link>>()
  for (const root of [...nodes].sort(compareNodes)) {
    if (visited.has(root.id)) continue

    const component: Node[] = []
    const pending = [root.id]
    while (pending.length > 0) {
      const id = pending.pop()
      if (id === undefined || visited.has(id)) continue

      const node = nodeById.get(id)
      if (node === undefined) {
        throw new Error(`Graph cluster contains unknown node ${id}`)
      }
      visited.add(id)
      component.push(node)
      for (const neighbor of getNeighbors(neighbors, id)) {
        pending.push(neighbor)
      }
    }

    const cluster: GraphCluster<Node, Link> = {
      nodes: component.sort(compareNodes),
      links: [],
    }
    clusters.push(cluster)
    for (const node of component) {
      clusterByNodeId.set(node.id, cluster)
    }
  }

  for (const link of links) {
    const sourceCluster = clusterByNodeId.get(link.source.id)
    const targetCluster = clusterByNodeId.get(link.target.id)
    if (sourceCluster === undefined || sourceCluster !== targetCluster) {
      throw new Error('Graph link does not belong to a cluster')
    }
    sourceCluster.links.push(link)
  }

  return clusters.sort(
    (a, b) =>
      b.nodes.length - a.nodes.length ||
      compareNodes(getItem(a.nodes, 0), getItem(b.nodes, 0)),
  )
}

function layoutCluster<Node extends LayoutNode, Link extends LayoutLink<Node>>(
  cluster: GraphCluster<Node, Link>,
) {
  const simulation = d3
    .forceSimulation(cluster.nodes)
    .force(
      'link',
      d3
        .forceLink<Node, Link>(cluster.links)
        .id((node) => node.id)
        .distance(100)
        .strength(0.45),
    )
    .force('charge', d3.forceManyBody().strength(-130))
    .force('center', d3.forceCenter(0, 0))
    .force('collision', d3.forceCollide<Node>().radius(26))
    .stop()

  simulation.tick(SIMULATION_TICKS)
}

function getClusterBounds(nodes: LayoutNode[]): Bounds {
  const x = nodes.map((node) => node.x ?? 0)
  const y = nodes.map((node) => node.y ?? 0)
  return {
    minX: Math.min(...x) - CLUSTER_PADDING,
    minY: Math.min(...y) - CLUSTER_PADDING,
    maxX: Math.max(...x) + CLUSTER_PADDING,
    maxY: Math.max(...y) + CLUSTER_PADDING,
  }
}

function getNeighbors(
  neighbors: Map<string, Set<string>>,
  id: string,
): Set<string> {
  const result = neighbors.get(id)
  if (result === undefined) {
    throw new Error(`Graph link contains unknown node ${id}`)
  }
  return result
}

function translateCluster(nodes: LayoutNode[], dx: number, dy: number) {
  for (const node of nodes) {
    node.x = (node.x ?? 0) + dx
    node.y = (node.y ?? 0) + dy
  }
}

function cumulativeOffsets(sizes: number[]) {
  const offsets: number[] = []
  let offset = 0
  for (const size of sizes) {
    offsets.push(offset)
    offset += size
  }
  return offsets
}

function getItem<T>(items: T[], index: number): T {
  const item = items[index]
  if (item === undefined) {
    throw new Error(`Missing graph layout item at index ${index}`)
  }
  return item
}

function width(bounds: Bounds) {
  return bounds.maxX - bounds.minX
}

function height(bounds: Bounds) {
  return bounds.maxY - bounds.minY
}

function compareNodes(a: LayoutNode, b: LayoutNode) {
  return a.id.localeCompare(b.id)
}
