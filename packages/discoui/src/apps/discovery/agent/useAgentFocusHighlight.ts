import { useMemo } from 'react'
import type { Node } from '../panel-nodes/store/State'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { topLevelByDescendant } from '../panel-nodes/store/utils/subnodes'
import type { AgentFocusHighlight } from '../panel-nodes/view/NodesAndConnectionsWebGL'
import { edgeKey, resolvePathEdges, toDrawn } from './pathEdges'
import { useAgentStore } from './store'
import { useGraphLinks } from './useGraphLinks'

export function useAgentFocusHighlight(
  drawn: readonly Node[],
): AgentFocusHighlight | undefined {
  const projectId = useNodeStore((state) => state.projectId)
  const focus = useAgentStore((state) =>
    state.focus?.project === projectId ? state.focus : undefined,
  )
  const links = useGraphLinks()
  return useMemo(() => {
    if (focus === undefined) {
      return undefined
    }
    const { nodes, edges } = toDrawn(
      focus.nodes,
      resolvePathEdges(focus.step.paths, links),
      topLevelByDescendant(drawn),
    )
    return {
      nodes,
      isOnPath: (from, to) => edges.has(edgeKey(from, to)),
    }
  }, [focus, links, drawn])
}
