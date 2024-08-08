import { assert, EthereumAddress } from '@l2beat/shared-pure'

type NodeId = number
export type Permission = 'act' | 'configure' | 'upgrade'

export interface Node {
  address: EthereumAddress
  threshold: number
  members: NodeId[]
  delay?: number
}

export interface Edge {
  type: Permission
  delay: number
  fromNode: NodeId
  toNode: NodeId
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

export interface PathElement {
  address: EthereumAddress
  delay: number
}

export interface GrantedPermission {
  type: Permission
  path: PathElement[]
}

export function resolvePermissions(graph: Graph): GrantedPermission[] {
  const result: GrantedPermission[] = []

  for (let nodeId = 0; nodeId < graph.nodes.length; nodeId += 1) {
    const node = graph.nodes[nodeId]
    assert(node !== undefined)

    const edges = graph.edges.filter((e) => e.fromNode === nodeId)
    const workCreatingEdges = edges.filter(
      (e) => e.type === 'configure' || e.type === 'upgrade',
    )
    for (const edge of workCreatingEdges) {
      const toNode = graph.nodes[edge.toNode]
      assert(toNode !== undefined)
      const newWork: GrantedPermission = {
        type: edge.type,
        path: [
          { address: node.address, delay: edge.delay + (node.delay ?? 0) },
          { address: toNode.address, delay: toNode.delay ?? 0 },
        ],
      }

      const visitedNodes: NodeId[] = []
      result.push(...floodFill(edge.toNode, graph, visitedNodes, newWork))
    }
  }

  return collapseUpgrades(result)
}

function floodFill(
  nodeId: NodeId,
  graph: Graph,
  visitedNodes: NodeId[],
  workingOn: GrantedPermission,
): GrantedPermission[] {
  if (visitedNodes.includes(nodeId)) {
    return [workingOn]
  }
  visitedNodes.push(nodeId)

  const node = graph.nodes[nodeId]
  assert(node !== undefined)

  const result: GrantedPermission[] = []
  const expandsMembers = node.threshold === 1 && node.members.length > 0
  if (expandsMembers) {
    for (const member of node.members) {
      result.push(
        ...copyWorkAndFlood(graph, member, 0, visitedNodes, workingOn),
      )
    }
  }

  const edges = graph.edges.filter((e) => e.fromNode === nodeId)
  const hasActEdges = edges.some((e) => e.type === 'act')
  for (const edge of edges) {
    if (edge.type === 'act') {
      const { toNode, delay } = edge
      result.push(
        ...copyWorkAndFlood(graph, toNode, delay, visitedNodes, workingOn),
      )
    }
  }

  if (!hasActEdges && !expandsMembers) {
    result.push(workingOn)
  }

  return result
}

function copyWorkAndFlood(
  graph: Graph,
  toNode: NodeId,
  delay: number,
  visitedNodes: NodeId[],
  workingOn: GrantedPermission,
) {
  const workCopy = structuredClone(workingOn)
  const node = graph.nodes[toNode]
  assert(node !== undefined)
  const lastElement = workCopy.path[workCopy.path.length - 1]
  if (lastElement !== undefined) {
    lastElement.delay += delay
  }
  workCopy.path.push({ address: node.address, delay: node.delay ?? 0 })
  return floodFill(toNode, graph, visitedNodes, workCopy)
}

function collapseUpgrades(input: GrantedPermission[]): GrantedPermission[] {
  const upgrades = input.filter((p) => p.type === 'upgrade')
  const configures = input.filter((p) => p.type === 'configure')
  const others = input.filter(
    (p) => p.type !== 'upgrade' && p.type !== 'configure',
  )

  const collapsed: GrantedPermission[] = []

  for (const upgrade of upgrades) {
    const matchingConfigure = configures.find(
      (configure) =>
        configure.path[0]?.address === upgrade.path[0]?.address &&
        configure?.path[configure.path.length - 1]?.address ===
          upgrade.path[upgrade.path.length - 1]?.address &&
        sumDelays(configure.path) >= sumDelays(upgrade.path),
    )

    if (matchingConfigure) {
      collapsed.push(upgrade)
      configures.splice(configures.indexOf(matchingConfigure), 1)
    } else {
      collapsed.push(upgrade)
    }
  }

  return [...collapsed, ...configures, ...others]
}

function sumDelays(path: PathElement[]): number {
  return path.reduce((sum, element) => sum + element.delay, 0)
}
