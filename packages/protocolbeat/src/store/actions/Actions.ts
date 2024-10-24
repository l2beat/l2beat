import type { SimpleNode } from '../../api/SimpleNode'
// import { OklchColor } from '../../utils/color'
import type { NodeColors, NodeLocations } from '../utils/storageParsing'

export interface Actions {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseDown: (event: MouseEvent, container: HTMLElement) => void
  onMouseMove: (event: MouseEvent, container: HTMLElement) => void
  onMouseUp: (event: MouseEvent) => void
  onWheel: (event: WheelEvent, view: HTMLElement) => void

  loadNodes: (projectId: string, nodes: SimpleNode[]) => void
  // layout: (cb: (nodes: Node[]) => NodeLocations) => void
  // recolorSelected: (color: OklchColor) => void
  // hideSelected: () => void
  // showHidden: () => void
  // clear: () => void

  updateNodes: (nodes: SimpleNode[]) => void
  updateNodeLocations: (locations: NodeLocations) => void
  updateNodeColors: (colors?: NodeColors) => void
  setProjectId: (projectId: string) => void

  setHiddenNodes: (update: (currentlyHiddenIds: string[]) => string[]) => void
}
