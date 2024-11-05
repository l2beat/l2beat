import { ApiAddressType } from '../../api/types'

export interface State {
  readonly projectId: string
  readonly nodes: readonly Node[]
  readonly selected: readonly string[]
  readonly hidden: readonly string[]
  readonly transform: {
    readonly offsetX: number
    readonly offsetY: number
    readonly scale: number
  }
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
  readonly selection?: Box
  readonly positionsBeforeMove: Readonly<
    Record<string, { readonly x: number; readonly y: number }>
  >
}

export interface Node {
  readonly id: string
  readonly address: string
  readonly addressType: ApiAddressType
  readonly name: string
  readonly fields: Field[]
  readonly box: Box
  readonly color: number
  readonly data: unknown
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
