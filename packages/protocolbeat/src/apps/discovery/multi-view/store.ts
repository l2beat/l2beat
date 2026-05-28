import { createDockingStore } from '../../../components/docking'
import { dockingConfig } from './config'

export const useDockingStore = createDockingStore(dockingConfig)

export type { PanelId } from './config'
export { PANEL_IDS } from './config'
