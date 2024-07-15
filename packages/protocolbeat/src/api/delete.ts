import type { SimpleNode } from './SimpleNode'

// prevents removal of the node that is still referenced
export function deleteNode(
  nodes: SimpleNode[],
  idsToRemove: string[],
): SimpleNode[] {
  const nodesReferencedFromDeletingNodes = nodes
    .filter((nodes) => idsToRemove.includes(nodes.id))
    .flatMap((node) => node.fields)
    .filter((field) => field.connection)
    .map((field) => field.connection)
    .filter(Boolean) // this filter is just to ensure TS knows that there can't undefined values here

  if (
    !nodesReferencedFromDeletingNodes.every((id) => {
      const itWillBeDeleted = idsToRemove.includes(id)
      const nodeDoesntExist = !nodes.some((node) => node.id === id)

      return itWillBeDeleted || nodeDoesntExist
    })
  ) {
    throw new Error(
      'Cannot delete nodes that are still referenced by other nodes',
    )
  }

  const nodesAfterRemoval = nodes.filter(
    (node) => !idsToRemove.includes(node.id),
  )

  return nodesAfterRemoval
}
