import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'

export function NodesAndConnections() {
  const nodes = useStore((state) => state.nodes)
  const hidden = useStore((state) => state.hidden)
  const selected = useStore((state) => state.selected)
  const visible = nodes.filter((node) => !hidden.includes(node.id))

  return (
    <>
      {visible.map((node) =>
        node.fields.map((field, i) => {
          const shouldHide = hidden.find((id) => id === field.target)

          if (shouldHide) {
            return null
          }

          return (
            <Connection
              key={`${node.id}-${i}-${field.target}`}
              from={field.connection.from}
              to={field.connection.to}
              isHighlighted={
                selected.includes(node.id) || selected.includes(field.target)
              }
            />
          )
        }),
      )}
      {visible.map((node) => (
        <NodeView
          key={node.id}
          node={node}
          selected={selected.includes(node.id)}
        />
      ))}
    </>
  )
}
