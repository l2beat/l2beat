import { SimpleNode } from '../api/SimpleNode'

export interface State {
  readonly selectedNodeIds: readonly string[]
  readonly hiddenNodesIds: readonly string[]
  readonly nodes: readonly Node[]
  readonly selection?: Box
  readonly transform: {
    readonly offsetX: number
    readonly offsetY: number
    readonly scale: number
  }
  readonly pressed: {
    readonly leftMouseButton: boolean
    readonly middleMouseButton: boolean
    readonly shiftKey: boolean
    readonly spaceKey: boolean
    readonly ctrlKey: boolean
  }
  readonly resizingNode?: {
    readonly id: string
    readonly initialWidth: number
    readonly startX: number
  }
  readonly mouseUpAction?: DeselectOne | DeselectAllBut
  readonly mouseMoveAction?:
    | 'drag'
    | 'pan'
    | 'select'
    | 'select-add'
    | 'resize-node'
  readonly mouseMove: {
    readonly startX: number
    readonly startY: number
    readonly currentX: number
    readonly currentY: number
  }
  readonly projectId: string
  readonly mouseSelection?: Box
  readonly selectedPositions: Readonly<
    Record<string, { readonly x: number; readonly y: number }>
  >
  readonly saveLayoutStartTime?: ReturnType<typeof setTimeout>
}

export interface Node {
  readonly simpleNode: SimpleNode
  readonly box: Box
  readonly fields: Field[]
}

export interface Field {
  readonly name: string
  readonly connection?: Connection
}

export interface Connection {
  readonly nodeId: string
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
