import type { ApiAgentLayout, ApiAgentLayoutRequest } from '../../../api/types'
import { readArrangement } from '../panel-nodes/store/actions/arrange'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { cutName, isDrawing, notLoaded } from './readGraph'

// The answer says what is drawn afterwards, read back from the node view,
// so the agent learns what hiding took away too.
export function applyLayout(request: ApiAgentLayoutRequest): ApiAgentLayout {
  const before = useNodeStore.getState()
  if (!isDrawing(before, request.project)) {
    return notLoaded(before)
  }
  before.arrange({ lanes: request.lanes, hideOthers: request.hideOthers })
  const arrangement = readArrangement(useNodeStore.getState(), request.lanes)
  return {
    status: 'arranged',
    placed: arrangement.placed,
    below: arrangement.below.map((node) => ({
      id: node.id,
      name: cutName(node.name),
    })),
    notDrawn: arrangement.notDrawn,
  }
}
