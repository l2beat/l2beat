import { useEffect } from 'react'

import { SimpleNode } from '../api/SimpleNode'
import { useStore } from '../store/store'
import { Connection } from './Connection'
import { NodeView } from './NodeView'
import { ScalableView } from './ScalableView'
import { useViewport } from './useViewport'

export interface ViewportProps {
  nodes: SimpleNode[]
  onDiscover: (nodeId: string) => void
  loading: Record<string, boolean | undefined>
}

export function Viewport(props: ViewportProps) {
  const { containerRef, viewRef } = useViewport()

  const updateNodes = useStore((state) => state.updateNodes)
  useEffect(() => {
    updateNodes(props.nodes)
  }, [updateNodes, props.nodes])

  const setHiddenNodes = useStore((state) => state.setHiddenNodes)

  const nodes = useStore((state) => state.nodes)
  const selectedNodeIds = useStore((state) => state.selectedNodeIds)
  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)

  const transform = useStore((state) => state.transform)
  const mouseSelection = useStore((state) => state.mouseSelection)

  const visibleNodes = nodes.filter(
    (node) => !hiddenNodesIds.includes(node.simpleNode.id),
  )

  function hideNode(nodeId: string) {
    setHiddenNodes((nodes) => [...nodes, nodeId])
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-lg bg-white"
    >
      <ScalableView ref={viewRef} transform={transform}>
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
            onDiscover={props.onDiscover}
            onHideNode={hideNode}
            loading={!!props.loading[node.simpleNode.id]}
          />
        ))}
      </ScalableView>
      {mouseSelection && (
        <div
          className="absolute border border-blue-600 bg-blue-100 bg-opacity-30"
          style={{
            left: mouseSelection.x,
            top: mouseSelection.y,
            width: mouseSelection.width,
            height: mouseSelection.height,
          }}
        />
      )}
    </div>
  )
}
