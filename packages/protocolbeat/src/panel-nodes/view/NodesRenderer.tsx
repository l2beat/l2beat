import { useMemo } from 'react'
import type { Node } from '../store/State'
import { NodeView } from './NodeView'

export interface NodesRendererProps {
  nodes: readonly Node[]
  selected: readonly string[]
  highlightedIds: Set<string>
  enableDimming: boolean
}

export function NodesRenderer({
  nodes,
  selected,
  highlightedIds,
  enableDimming,
}: NodesRendererProps) {
  const nodeElements = useMemo(() => {
    return nodes.map((node) => {
      const nodeHighlighted = highlightedIds.has(node.id)
      const isDimmed = enableDimming && selected.length > 0 && !nodeHighlighted

      return (
        <NodeView
          key={node.id}
          node={node}
          selected={selected.includes(node.id)}
          isDimmed={isDimmed}
        />
      )
    })
  }, [nodes, selected, highlightedIds, enableDimming])

  return <>{nodeElements}</>
}
