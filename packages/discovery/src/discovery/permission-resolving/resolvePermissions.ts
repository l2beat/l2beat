import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { Permission } from '../config/RawDiscoveryConfig'

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
  edges: Edge<T>[]
  canActIndependently: boolean
}

export interface Edge<T = EthereumAddress> {
  permission: Permission
  delay: number
  description?: string
  toNode: T
}

export interface PathElement<T = EthereumAddress> {
  address: T
  delay: number
  description?: string
}

export interface ResolvedPermission<T = EthereumAddress> {
  permission: Permission
  path: PathElement<T>[]
}

export function resolvePermissions<T>(
  graph: Node<T>[],
): ResolvedPermission<T>[] {
  const result: ResolvedPermission<T>[] = []
  for (const node of graph) {
    const seedingEdges = node.edges.filter(
      (e) => e.permission !== 'member' && e.permission !== 'act',
    )
    for (const edge of seedingEdges) {
      const toNode = getNode(edge.toNode, graph)
      const resolved: ResolvedPermission<T> = {
        permission: edge.permission,
        path: [
          {
            address: node.address,
            delay: edge.delay + node.delay,
            description: undefined,
          },
          {
            address: toNode.address,
            delay: toNode.delay,
            description: edge.description,
          },
        ],
      }
      result.push(...followThrough(edge.toNode, graph, [], resolved))
    }
  }
  return result
}

function followThrough<T>(
  address: T,
  graph: Node<T>[],
  visited: T[],
  resolved: ResolvedPermission<T>,
): ResolvedPermission<T>[] {
  if (visited.includes(address)) {
    // A cycle in the graph of "act" permissions has been encountered.
    // This is a deadlock (e.g only B can act on A, but only A can act on B),
    // the path can't be triggered, so return an empty array.
    return []
  }

  const node = getNode(address, graph)
  const result: ResolvedPermission<T>[] = []

  let followed = false
  for (const edge of node.edges) {
    if (
      edge.permission === 'act' ||
      (node.threshold === 1 && edge.permission === 'member')
    ) {
      followed = true

      const toNode = getNode(edge.toNode, graph)
      const clone = structuredClone(resolved)
      const last = clone.path[clone.path.length - 1]
      if (last !== undefined) {
        last.delay += edge.delay
      }
      clone.path.push({
        address: toNode.address,
        delay: toNode.delay,
        description: edge.description,
      })
      result.push(
        ...followThrough(toNode.address, graph, [...visited, address], clone),
      )
    }
  }

  if (!followed) {
    result.push(resolved)
  }
  return result
}

function getNode<T>(address: T, graph: Node<T>[]): Node<T> {
  const node = graph.find((n) => n.address === address)
  assert(node !== undefined, `Cannot find node ${address}`)
  return node
}
