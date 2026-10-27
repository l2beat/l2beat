import { useMemo } from 'react'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { linksOf } from './pathEdges'

// Field links change only when a project loads; dragging and grouping move
// boxes and wrap nodes but keep every leaf's fields. So the walk over every
// field runs once per load, not on every frame of a drag. A reload can batch
// clear and load into one render, so the node count keys it too.
export function useGraphLinks(): ReadonlySet<string> {
  const projectId = useNodeStore((state) => state.projectId)
  const loaded = useNodeStore((state) => state.loaded)
  const nodeCount = useNodeStore((state) => state.nodes.length)
  return useMemo(() => {
    const state = useNodeStore.getState()
    if (!loaded || state.projectId !== projectId || nodeCount === 0) {
      return new Set<string>()
    }
    return linksOf(state.nodes)
  }, [projectId, loaded, nodeCount])
}
