import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'

export function NodesAndConnections() {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)
  const selectedNodeIds = useStore((state) => state.selected)
  const visibleNodes = nodes.filter(
    (node) => !hiddenNodesIds.includes(node.simpleNode.id),
  )

  return (
    <>
      {visibleNodes.map((node) =>
        node.fields.map((field, i) => {
          const shouldHide =
            !field.connection ||
            hiddenNodesIds.find((id) => id === field.connection?.nodeId)

          if (shouldHide) {
            return null
          }

          return (
            <Connection
              key={`${node.simpleNode.id}-${i}-${field.connection.nodeId}`}
              from={field.connection.from}
              to={field.connection.to}
              isHighlighted={
                selectedNodeIds.includes(node.simpleNode.id) ||
                selectedNodeIds.includes(field.connection.nodeId)
              }
            />
          )
        }),
      )}
      {visibleNodes.map((node) => (
        <NodeView
          key={node.simpleNode.id}
          node={node}
          selected={selectedNodeIds.includes(node.simpleNode.id)}
          discovered={node.simpleNode.discovered}
        />
      ))}
    </>
  )
}
