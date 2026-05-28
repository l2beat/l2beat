import type { ApiAddressType, ApiEntrypointGroup } from '../../../../api/types'

export interface State {
  readonly projectId: string
  readonly nodes: readonly Node[]
  readonly entrypointGroups: readonly ApiEntrypointGroup[]
  readonly collapsedEntrypointGroups: readonly string[]
  readonly selected: readonly string[]
  readonly hidden: readonly string[]
  readonly history: HistoryState
  readonly userPreferences: {
    readonly enableDimming: boolean
    readonly hideLargeArrays: boolean
    readonly highlightOverlapping: boolean
    readonly useExperimentalRenderer: boolean
  }
  readonly transform: {
    readonly offsetX: number
    readonly offsetY: number
    readonly scale: number
  }
  readonly viewportContainer?: HTMLElement
  readonly input: {
    readonly shiftPressed: boolean
    readonly spacePressed: boolean
    readonly ctrlPressed: boolean
    readonly lmbPressed: boolean
    readonly mmbPressed: boolean
    readonly mouseStartX: number
    readonly mouseStartY: number
    readonly mouseX: number
    readonly mouseY: number
  }
  readonly resizingNode?: string
  readonly mouseUpAction?: DeselectOne | DeselectAllBut
  readonly mouseMoveAction?:
    | 'drag'
    | 'pan'
    | 'select'
    | 'select-add'
    | 'resize-node'
    | 'expand-entrypoint'
  readonly entrypointExpandGroupId?: string
  readonly selection?: Box
  readonly positionsBeforeMove: Readonly<
    Record<string, { readonly x: number; readonly y: number }>
  >
  readonly loaded: boolean
}

export interface EntrypointGroupInfo {
  readonly groupId: string
  readonly label: string
  readonly sourceProject: string
  readonly contractCount: number
  readonly eoaCount: number
  readonly bridgeAddress: string
  readonly summary: string
}

export interface Node {
  readonly id: string
  readonly address: string
  readonly isInitial: boolean
  readonly hasTemplate: boolean
  readonly addressType: ApiAddressType
  readonly name: string
  readonly fields: Field[]
  readonly hiddenFields: string[]
  readonly box: Box
  readonly color: number
  readonly hueShift: number
  readonly data: unknown
  readonly isReachable: boolean
  readonly appearsInProjectsCount?: number
  readonly appearsInProjects?: readonly { project: string; hasEntrypoint: boolean }[]
  readonly entrypointGroup?: EntrypointGroupInfo
  /** Set when this node belongs to a collapsible external entrypoint module. */
  readonly entrypointMemberOf?: string
}

export interface HistoryState {
  readonly past: readonly HistorySnapshot[]
  readonly future: readonly HistorySnapshot[]
  readonly pending?: HistorySnapshot
}

export interface HistorySnapshot {
  readonly nodes: readonly HistorySnapshotNode[]
  readonly hidden: readonly string[]
}

export interface HistorySnapshotNode {
  readonly id: string
  readonly box: Box
  readonly color: number
  readonly hiddenFields: readonly string[]
}

export interface Field {
  readonly name: string
  readonly target: string
  readonly box: Box
  readonly connection: Connection
}

export interface Connection {
  readonly from: {
    readonly direction: 'left' | 'right'
    readonly x: number
    readonly y: number
  }
  readonly to: {
    readonly direction: 'left' | 'right'
    readonly x: number
    readonly y: number
  }
}

export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface DeselectOne {
  readonly type: 'DeselectOne'
  readonly id: string
}

export interface DeselectAllBut {
  readonly type: 'DeselectAllBut'
  readonly id: string
}
