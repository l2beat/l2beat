import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import type { Permission } from '../config/RawDiscoveryConfig'

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
  canActIndependently: boolean | undefined
}

export interface Edge<T = EthereumAddress> {
  permission: Permission
  delay: number
  condition?: string
  description?: string
  toNode: T
}

export interface PathElement<T = EthereumAddress> {
  address: T
  gives: Permission | undefined
  delay: number
  description?: string
  condition?: string
}

export interface ResolvedPermission<T = EthereumAddress> {
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
        path: [
          {
            address: node.address,
            delay: edge.delay + node.delay,
            description: edge.description,
            condition: edge.condition,
            gives: edge.permission,
          },
          {
            address: toNode.address,
            delay: 0,
            gives: undefined,
            description: undefined,
            condition: undefined,
          },
        ],
      }
      result.push(...followThrough(edge.toNode, graph, [], resolved))
    }
  }
  return result
}

// NOTE(radomski): Multisig that has a threshold that's higher than one will
// not follow through into his members. This means that the permission path
// "ends" on the multisig. But if the multisig has a module we want to give
// that module an act permission. An undesirable effect of it is removing the
// path which ends at the multisig. It's still there because now we have two
// entry points into the chain. Either the participants sign over the threshold
// and the permission is executed or the module under the right conditions will
// act in place of the members through the multisig.
//
// If the multisig has a threshold higher than one and it gives an act
// permission to somebody copy the route to it.
function isMultisigAndActsIndependently<T>(node: Node<T>): boolean {
  return (
    node.threshold > 1 &&
    node.edges.find((e) => e.permission === 'member') !== undefined &&
    node.edges.find((e) => e.permission === 'act') !== undefined
  )
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
      clone.path.pop()
      clone.path.push({
        address: node.address,
        gives: edge.permission,
        delay: edge.delay + node.delay,
        description: edge.description,
        condition: edge.condition,
      })
      clone.path.push({
        address: toNode.address,
        gives: undefined,
        delay: 0,
        description: undefined,
        condition: undefined,
      })
      result.push(
        ...followThrough(toNode.address, graph, [...visited, address], clone),
      )
    }
  }

  const canActIndependently = isMultisigAndActsIndependently(node)
    ? true
    : node.canActIndependently

  if (!followed && canActIndependently !== false) {
    result.push(resolved)
  } else if (canActIndependently) {
    result.push(structuredClone(resolved))
  }

  return result
}

function getNode<T>(address: T, graph: Node<T>[]): Node<T> {
  const node = graph.find((n) => n.address === address)
  assert(node !== undefined, `Cannot find node ${address}`)
  return node
}
