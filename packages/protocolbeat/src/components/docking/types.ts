import type { ReactNode } from 'react'

export type TabId = string
export type NodeId = string

export type SplitDirection = 'row' | 'column'
export type Edge = 'top' | 'right' | 'bottom' | 'left'

export type LeafNode = {
  kind: 'leaf'
  id: NodeId
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
  kind: 'split'
  leafId: NodeId
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
  renderTabExtras?: (props: { id: TabId; leafId: NodeId }) => ReactNode
}
