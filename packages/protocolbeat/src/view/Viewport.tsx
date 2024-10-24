import { useEffect } from 'react'

import type { SimpleNode } from '../api/SimpleNode'
import { useStore } from '../store/store'
import { ConnectionsCanvas } from './ConnectionsCanvas'
import { NodeViewCanvas } from './NodeViewCanvas'
import { useViewport } from './useViewport'

export interface ViewportProps {
  nodes: SimpleNode[]
  loading: Record<string, boolean | undefined>
}

export function Viewport(props: ViewportProps) {
  const { containerRef, viewRef } = useViewport()

  const updateNodes = useStore((state) => state.updateNodes)
  useEffect(() => {
    updateNodes(props.nodes)
  }, [updateNodes, props.nodes])

  const nodes = useStore((state) => state.nodes)
  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)

  const transform = useStore((state) => state.transform)
  const mouseSelection = useStore((state) => state.mouseSelection)

  const visibleNodes = nodes.filter(
    (node) => !hiddenNodesIds.includes(node.simpleNode.id),
  )

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-lg bg-white"
    >
      <div
        ref={viewRef}
        className="relative h-full w-full origin-[0_0] select-none"
      >
        <ConnectionsCanvas nodes={visibleNodes} transform={transform} />
        <NodeViewCanvas nodes={visibleNodes} transform={transform} />
      </div>
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
