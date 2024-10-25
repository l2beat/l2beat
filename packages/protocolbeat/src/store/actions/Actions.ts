import { OklchColor } from '../../utils/color'
import { SimpleNode } from '../State'
import type { NodeLocations } from '../utils/storageParsing'

export interface Actions {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseDown: (event: MouseEvent, container: HTMLElement) => void
  onMouseMove: (event: MouseEvent, container: HTMLElement) => void
  onMouseUp: (event: MouseEvent) => void
  onWheel: (event: WheelEvent, view: HTMLElement) => void

  loadNodes: (projectId: string, nodes: SimpleNode[]) => void
  colorSelected: (color: OklchColor) => void
  hideSelected: () => void
  showHidden: () => void
  clear: () => void

  updateNodes: (nodes: SimpleNode[]) => void
  updateNodeLocations: (locations: NodeLocations) => void
}
