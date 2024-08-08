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

export interface Node<T = EthereumAddress> {
  address: T
  threshold: number
  delay: number
  edges: Edge[]
}

export interface Edge {
  type: Permission
  delay: number
  toNode: NodeId
}

export interface PathElement<T = EthereumAddress> {
  address: T
  delay: number
}

export interface GrantedPermission<T = EthereumAddress> {
  type: Permission
  path: PathElement<T>[]
}

export function resolvePermissions<T>(
  graph: Node<T>[],
): GrantedPermission<T>[] {
  const result: GrantedPermission<T>[] = []

  for (const node of graph) {
    const edges = node.edges
    const workCreatingEdges = edges.filter(
      (e) => e.type === 'configure' || e.type === 'upgrade',
    )
    for (const edge of workCreatingEdges) {
      const toNode = graph[edge.toNode]
      assert(toNode !== undefined)
      const newWork: GrantedPermission<T> = {
        type: edge.type,
        path: [
          { address: node.address, delay: edge.delay + node.delay },
          { address: toNode.address, delay: toNode.delay },
        ],
      }

      result.push(...floodFill(edge.toNode, graph, [], newWork))
    }
  }

  return collapseUpgrades(result)
}

function floodFill<T>(
  nodeId: NodeId,
  graph: Node<T>[],
  visited: NodeId[],
  workingOn: GrantedPermission<T>,
): GrantedPermission<T>[] {
  if (visited.includes(nodeId)) {
    // TODO: (sz-piotr) empty array?
    return [workingOn]
  }

  const node = graph[nodeId]
  assert(node !== undefined)

  const result: GrantedPermission<T>[] = []
  const edges = node.edges
  const expandsMembers =
    node.threshold === 1 && edges.some((e) => e.type === 'member')
  const hasActEdges = edges.some((e) => e.type === 'act')
  for (const edge of edges) {
    if (edge.type === 'act' || (expandsMembers && edge.type === 'member')) {
      const { toNode, delay } = edge
      result.push(
        ...copyWorkAndFlood(
          graph,
          toNode,
          delay,
          [...visited, nodeId],
          workingOn,
        ),
      )
    }
  }

  if (!hasActEdges && !expandsMembers) {
    result.push(workingOn)
  }

  return result
}

function copyWorkAndFlood<T>(
  graph: Node<T>[],
  toNode: NodeId,
  delay: number,
  visitedNodes: NodeId[],
  workingOn: GrantedPermission<T>,
) {
  const workCopy = structuredClone(workingOn)
  const node = graph[toNode]
  assert(node !== undefined)
  const lastElement = workCopy.path[workCopy.path.length - 1]
  if (lastElement !== undefined) {
    lastElement.delay += delay
  }
  workCopy.path.push({ address: node.address, delay: node.delay })
  return floodFill(toNode, graph, visitedNodes, workCopy)
}

function collapseUpgrades<T>(
  input: GrantedPermission<T>[],
): GrantedPermission<T>[] {
  const upgrades = input.filter((p) => p.type === 'upgrade')
  const configures = input.filter((p) => p.type === 'configure')
  const others = input.filter(
    (p) => p.type !== 'upgrade' && p.type !== 'configure',
  )

  const collapsed: GrantedPermission<T>[] = []

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

function sumDelays<T>(path: PathElement<T>[]): number {
  return path.reduce((sum, element) => sum + element.delay, 0)
}
