import {
  createDockingStore,
  nextAvailableKey,
} from '../../../components/docking'
import { dockingConfig, isAllowedPanel, PANEL_IDS } from './config'

export const useDockingStore = createDockingStore(dockingConfig)

// Opening "the next panel" is catalog logic: it depends on the set of panel
// kinds, which lives here, not in the generic layout.
export function addPanel(): void {
  const state = useDockingStore.getState()
  const next = nextAvailableKey(state.tree, PANEL_IDS.filter(isAllowedPanel))
  if (next) state.ensureLeaf(next)
}

export type { PanelId } from './config'
export { PANEL_IDS } from './config'
