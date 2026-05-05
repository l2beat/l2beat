import type { Node, State } from '../State'
import type { NodeLocations, StoredNodeLayout } from '../utils/storage'
import type { ApplyLayoutMode } from './applyStoredLayout'

export interface Actions {
  /**
   * Mouse event handlers - these support both desktop and mobile interactions
   * Mobile touch events are mapped to equivalent mouse events in the Viewport component
   */
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseDown: (event: MouseEvent, container: HTMLElement) => void
  onMouseMove: (
    event: MouseEvent,
    container: HTMLElement,
    opts?: { disableSelection?: boolean },
  ) => void
  onMouseUp: (event: MouseEvent) => void
  onWheel: (event: WheelEvent, view: HTMLElement) => void

  loadNodes: (projectId: string, nodes: Node[]) => void
  setNodes: (nodes: Node[]) => void
  colorSelected: (color: number) => void
  layout: (locations: NodeLocations) => void
  undo: () => void
  redo: () => void
  applyStoredLayout: (saved: StoredNodeLayout, mode: ApplyLayoutMode) => void
  hideSelected: () => void
  hideUnknowns: () => void
  hideUnreachable: () => void
  showUnreachable: () => void
  showHidden: () => void
  clear: () => void
  selectAndFocus: (selected: string) => void
  registerViewportContainer: (container: HTMLElement | null) => void

  setPreferences: (preferences: Partial<State['userPreferences']>) => void
}
