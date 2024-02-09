import { SimpleNode } from '../../api/SimpleNode'
import { NodeLocations } from '../utils/storageParsing'

export interface Actions {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseDown: (event: MouseEvent, container: HTMLElement) => void
  onMouseMove: (event: MouseEvent, container: HTMLElement) => void
  onMouseUp: (event: MouseEvent) => void
  onWheel: (event: WheelEvent, view: HTMLElement) => void

  updateNodes: (nodes: SimpleNode[]) => void
  updateNodeLocations: (locations: NodeLocations) => void
  setProjectId: (projectId: string) => void

  setHiddenNodes: (update: (currentlyHiddenIds: string[]) => string[]) => void
}
