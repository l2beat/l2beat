export type Operation = StaticOperation | RecursiveOperation

interface StaticOperation {
  type: 'static'
  name: string
  count: number
}

interface RecursiveOperation {
  type: 'recursive'
  calldata: string
}

export interface Method {
  name: string
  selector: string
  count(calldata: string): Operation[]
}
