import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'

export function NodesAndConnections() {
  const nodes = useStore((state) => state.nodes)
  const hidden = useStore((state) => state.hidden)
  const selected = useStore((state) => state.selected)
  const enableDimming = useStore((state) => state.userPreferences.enableDimming)
  const visible = nodes.filter((node) => !hidden.includes(node.id))

  // Only compute highlighted nodes if dimming is enabled and we have selections
  const highlightedNodeIds =
    enableDimming && selected.length > 0
      ? (() => {
          // Get the IDs of the first-degree neighbors of selected nodes
          const firstDegreeNeighborIds = visible
            .filter((node) => selected.includes(node.id))
            .flatMap((node) =>
              node.fields
                .filter((field) => !node.hiddenFields.includes(field.name)) // Only consider visible fields
                .map((field) => field.target),
            )
            .filter((id) => !hidden.includes(id))

          // Get target nodes pointing to selected nodes
          const nodesPointingToSelected = visible
            .filter((node) =>
              node.fields
                .filter((field) => !node.hiddenFields.includes(field.name)) // Only consider visible fields
                .some((field) => selected.includes(field.target)),
            )
            .map((node) => node.id)

          // Combine all highlighted node IDs
          return [
            ...new Set([
              ...selected,
              ...firstDegreeNeighborIds,
              ...nodesPointingToSelected,
            ]),
          ]
        })()
      : []

  return (
    <>
      {visible.map((node) =>
        node.fields.map((field, i) => {
          const shouldHide =
            hidden.includes(field.target) ||
            node.hiddenFields.includes(field.name)

          if (shouldHide) {
            return null
          }

          // Check if this connection is to an EOA node
          const targetNode = visible.find((n) => n.id === field.target)
          const isDashed = targetNode?.addressType === 'EOA'

          // A connection is highlighted ONLY if:
          // 1. It's directly from a selected node to any target
          // 2. It's directly to a selected node from any source
          // NOT if it's from a first-degree neighbor (unless that neighbor is also selected)
          const connectionHighlighted =
            selected.includes(node.id) || selected.includes(field.target)

          // Dim connections when there are selected nodes, dimming is enabled, and this connection is not highlighted
          const isDimmed =
            enableDimming && selected.length > 0 && !connectionHighlighted

          return (
            <Connection
              key={`${node.id}-${i}-${field.target}`}
              from={field.connection.from}
              to={field.connection.to}
              isHighlighted={connectionHighlighted}
              isDashed={isDashed}
              isDimmed={isDimmed}
            />
          )
        }),
      )}
      {visible.map((node) => {
        // A node is highlighted if it's selected or is a first-degree neighbor of a selected node
        const nodeHighlighted =
          enableDimming && selected.length > 0
            ? highlightedNodeIds.includes(node.id)
            : selected.includes(node.id)

        // Dim nodes when there are selected nodes, dimming is enabled, and this node is not highlighted
        const isDimmed =
          enableDimming && selected.length > 0 && !nodeHighlighted

        return (
          <NodeView
            key={node.id}
            node={node}
            selected={selected.includes(node.id)}
            isDimmed={isDimmed}
          />
        )
      })}
    </>
  )
}
