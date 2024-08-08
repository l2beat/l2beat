import { assert, EthereumAddress } from '@l2beat/shared-pure'

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

export type Permission = 'member' | 'act' | 'configure' | 'upgrade'

export interface Node<T = EthereumAddress> {
  address: T
  threshold: number
  delay: number
  edges: Edge<T>[]
}

export interface Edge<T = EthereumAddress> {
  permission: Permission
  delay: number
  toNode: T
}

export interface PathElement<T = EthereumAddress> {
  address: T
  delay: number
}

export interface GrantedPermission<T = EthereumAddress> {
  permission: Permission
  path: PathElement<T>[]
}

export function resolvePermissions<T>(
  graph: Node<T>[],
): GrantedPermission<T>[] {
  const result: GrantedPermission<T>[] = []

  for (const node of graph) {
    const edges = node.edges
    const workCreatingEdges = edges.filter(
      (e) => e.permission === 'configure' || e.permission === 'upgrade',
    )
    for (const edge of workCreatingEdges) {
      const toNode = graph.find((n) => n.address === edge.toNode)
      assert(toNode !== undefined, `Cannot find node ${edge.toNode}`)
      const newWork: GrantedPermission<T> = {
        permission: edge.permission,
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
  address: T,
  graph: Node<T>[],
  visited: T[],
  workingOn: GrantedPermission<T>,
): GrantedPermission<T>[] {
  if (visited.includes(address)) {
    // TODO: (sz-piotr) empty array?
    return [workingOn]
  }

  const node = graph.find((n) => n.address === address)
  assert(node !== undefined, `Cannot find node ${address}`)

  const result: GrantedPermission<T>[] = []
  const edges = node.edges
  const expandsMembers =
    node.threshold === 1 && edges.some((e) => e.permission === 'member')
  const hasActEdges = edges.some((e) => e.permission === 'act')
  for (const edge of edges) {
    if (
      edge.permission === 'act' ||
      (expandsMembers && edge.permission === 'member')
    ) {
      const { toNode, delay } = edge
      result.push(
        ...copyWorkAndFlood(
          graph,
          toNode,
          delay,
          [...visited, address],
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
  address: T,
  delay: number,
  visitedNodes: T[],
  workingOn: GrantedPermission<T>,
) {
  const workCopy = structuredClone(workingOn)
  const node = graph.find((n) => n.address === address)
  assert(node !== undefined, `Cannot find node ${address}`)
  const lastElement = workCopy.path[workCopy.path.length - 1]
  if (lastElement !== undefined) {
    lastElement.delay += delay
  }
  workCopy.path.push({ address: node.address, delay: node.delay })
  return floodFill(address, graph, visitedNodes, workCopy)
}

function collapseUpgrades<T>(
  input: GrantedPermission<T>[],
): GrantedPermission<T>[] {
  const upgrades = input.filter((p) => p.permission === 'upgrade')
  const configures = input.filter((p) => p.permission === 'configure')
  const others = input.filter(
    (p) => p.permission !== 'upgrade' && p.permission !== 'configure',
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
