import type { State } from '../State'
import { resolveFocusNodeId } from '../utils/entrypointGroups'

export function selectNodes(
  state: State,
  selected: readonly string[],
): Partial<State> {
  const normalized = [
    ...new Set(
      selected.map((id) =>
        resolveFocusNodeId(id, {
          entrypointGroups: state.entrypointGroups,
          collapsedEntrypointGroups: state.collapsedEntrypointGroups,
          hidden: state.hidden,
        }),
      ),
    ),
  ]
  return { selected: normalized }
}
