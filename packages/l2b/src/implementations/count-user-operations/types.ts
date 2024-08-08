export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  name: string
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
}

export interface Method {
  name: string
  selector: string
  count(calldata: string): Operation[]
}
