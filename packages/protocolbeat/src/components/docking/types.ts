import type { ReactNode } from 'react'

export type TabId = string
export type NodeId = string

export type SplitDirection = 'row' | 'column'
export type Edge = 'top' | 'right' | 'bottom' | 'left'

// A leaf is identified by its tab. validateLayout enforces tab uniqueness
// across the tree, so the tab is the leaf's identity; no separate id needed.
export type LeafNode = {
  kind: 'leaf'
  tab: TabId
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
  tab: TabId
  edge: Edge
}

export interface DockingConfig {
  storageKey: string
  availableTabs: readonly TabId[]
  filterTab?: (id: TabId) => boolean
  defaultLayout: LayoutNode
  maxLayouts?: number
  renderBody: (id: TabId) => ReactNode
  renderTabLabel: (id: TabId) => ReactNode
  renderTabExtras?: (props: { id: TabId }) => ReactNode
}
