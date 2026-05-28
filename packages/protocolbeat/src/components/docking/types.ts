import type { ReactNode } from 'react'

export type TabId = string
export type NodeId = string

export type SplitDirection = 'row' | 'column'
export type Edge = 'top' | 'right' | 'bottom' | 'left'

export type SplitNode = {
  kind: 'split'
  id: NodeId
  direction: SplitDirection
  sizes: number[]
  children: LayoutNode[]
}

export type GroupNode = {
  kind: 'group'
  id: NodeId
  tabs: TabId[]
  active: TabId
}

export type LayoutNode = SplitNode | GroupNode

export type DropTarget =
  | { kind: 'into-group'; groupId: NodeId; index: number }
  | { kind: 'split'; groupId: NodeId; edge: Edge }

export interface DockingConfig {
  storageKey: string
  availableTabs: readonly TabId[]
  filterTab?: (id: TabId) => boolean
  defaultLayout: LayoutNode
  maxLayouts?: number
  renderBody: (id: TabId) => ReactNode
  renderTabLabel: (id: TabId) => ReactNode
  renderTabExtras?: (props: { id: TabId; groupId: NodeId }) => ReactNode
}
