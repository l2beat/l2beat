import type { ReactNode } from 'react'

// A docking layout arranges opaque regions ("leaves") into resizable splits.
// It knows a leaf only by its key, a string the consumer assigns and interprets.
// validateLayout enforces key uniqueness, so the key is the leaf's identity.
export type LeafKey = string
export type NodeId = string

export type SplitDirection = 'row' | 'column'
export type Edge = 'top' | 'right' | 'bottom' | 'left'

export type LeafNode = {
  kind: 'leaf'
  key: LeafKey
}

export type SplitNode = {
  kind: 'split'
  id: NodeId
  direction: SplitDirection
  sizes: number[]
  children: LayoutNode[]
}

export type LayoutNode = LeafNode | SplitNode

export type DropTarget = {
  key: LeafKey
  edge: Edge
}

// Passed to the consumer's header renderer so it can reflect focus/fullscreen.
export interface LeafApi {
  key: LeafKey
  isActive: boolean
  isFullScreen: boolean
}

// The layout owns geometry and interaction; the consumer owns content. It draws
// the header bar (drag handle, fullscreen, close) and the body container, then
// fills them via these render slots. No knowledge of what a key "is" leaks in.
export interface DockingConfig {
  storageKey: string
  defaultLayout: LayoutNode
  maxLayouts?: number
  isValidKey?: (key: LeafKey) => boolean
  renderHeader: (api: LeafApi) => ReactNode
  renderBody: (key: LeafKey) => ReactNode
  renderDragPreview?: (key: LeafKey) => ReactNode
}
