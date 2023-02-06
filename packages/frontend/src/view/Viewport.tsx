import { useEffect, useRef } from 'react'

import { Connection } from './Connection'
import { NodeView } from './NodeView'
import { useViewportState } from './utils/useViewportState'

export interface ViewportProps {
  nodes: {
    id: string
    name: string
    discovered: boolean
    fields: {
      name: string
      connection?: string
    }[]
  }[]
  onDiscover: (nodeId: string) => void
  onSelectionChange: (selection: readonly string[]) => void
  loading: Record<string, boolean | undefined>
}

export function Viewport(props: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<readonly string[]>([])

  const state = useViewportState(props.nodes, containerRef, viewRef)
  useEffect(() => {
    if (selectionRef.current !== state.selectedNodeIds) {
      selectionRef.current = state.selectedNodeIds
      props.onSelectionChange(state.selectedNodeIds)
    }
  }, [state, props.onSelectionChange])

  const transform = `translate(${state.transform.offsetX}px, ${state.transform.offsetY}px) scale(${state.transform.scale})`

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg bg-white relative overflow-hidden"
    >
      <div
        ref={viewRef}
        className="w-full h-full bg-[url(/grid.svg)] bg-center relative select-none origin-[0_0]"
        style={{ transform }}
      >
        {state.nodes.map((node) =>
          node.fields.map(
            (field, i) =>
              field.connection && (
                <Connection
                  key={`${node.id}-${i}-${field.connection.nodeId}`}
                  from={field.connection.from}
                  to={field.connection.to}
                />
              ),
          ),
        )}
        {state.nodes.map((node) => (
          <NodeView
            key={node.id}
            node={node}
            selected={state.selectedNodeIds.includes(node.id)}
            discovered={node.discovered}
            onDiscover={props.onDiscover}
            loading={!!props.loading[node.id]}
          />
        ))}
      </div>
    </div>
  )
}
