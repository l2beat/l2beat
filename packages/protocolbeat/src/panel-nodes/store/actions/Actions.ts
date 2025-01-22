import type { Node } from '../State'
import type { NodeLocations } from '../utils/storage'

export interface Actions {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseDown: (event: MouseEvent, container: HTMLElement) => void
  onMouseMove: (event: MouseEvent, container: HTMLElement) => void
  onMouseUp: (event: MouseEvent) => void
  onWheel: (event: WheelEvent, view: HTMLElement) => void

  loadNodes: (projectId: string, nodes: Node[]) => void
  colorSelected: (color: number) => void
  layout: (locations: NodeLocations) => void
  hideSelected: () => void
  showHidden: () => void
  clear: () => void
  selectAndFocus: (selected: readonly string[]) => void
}
