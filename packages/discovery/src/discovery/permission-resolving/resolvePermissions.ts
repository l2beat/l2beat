import { assert, EthereumAddress } from '@l2beat/shared-pure'

type NodeId = number
export type Permission = 'member' | 'act' | 'configure' | 'upgrade'

// NOTE(radomski): The entire permission network is modeled as a graph. The
// graph contains nodes and edges. Nodes are contracts and edges are "actions"
// that contracts can perform on each other. Types of actions that can be
// performed are defined by the type Permission.
//
// Each node contains threshold which is redundant for contracts that are not
// multisigs, but it makes the processing easier to set it to one for
// non-multisig contracts. It also contains a delay field which allows to model
// things like multisigs with delays or contracts which always execute an
// operation with some additional baseline delay.
//
// Edges link two nodes together and define the action that can take place on
// that link. Each action can have a execution delay which is additive to the
// node on which that action can take place.
//
// Multisigs are modeled as a link between the multisig and the owner with the
// permission type set to 'member'. This is really powerful but as always with
// great power comes great responsibility and setting the delays on the edge
// level for multisig members can introduce a lot of potential confusion when
// these delays will start to drift apart. Current implementation does not say
// what to do in a scenario when one members has a smaller delay than others
// and such a case should be discussed.

export interface Node {
  address: EthereumAddress
  threshold: number
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
  const edges = graph.edges.filter((e) => e.fromNode === nodeId)
  const expandsMembers = node.threshold === 1 && edges.some((e) => e.type === 'member')
  const hasActEdges = edges.some((e) => e.type === 'act')
  for (const edge of edges) {
    if (edge.type === 'act' || (expandsMembers && edge.type === 'member')) {
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
