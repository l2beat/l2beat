import { useMemo } from 'react'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { getGraphProjection } from '../panel-nodes/store/utils/graphProjection'
import { linksOf } from './pathEdges'

// Dragging moves boxes but keeps every leaf's fields, so the walk over every
// field runs only when the graph projection rebuilds its edges: when a field
// changes, a reload of the same project included, not on every drag frame.
export function useGraphLinks(): ReadonlySet<string> {
  const edges = useNodeStore((state) =>
    state.loaded ? getGraphProjection(state.nodes).incomingByTarget : undefined,
  )
  return useMemo(
    () =>
      edges === undefined
        ? new Set<string>()
        : linksOf(useNodeStore.getState().nodes),
    [edges],
  )
}
