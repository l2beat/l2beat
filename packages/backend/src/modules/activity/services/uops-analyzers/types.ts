export interface CountedOperation {
  count: number
  children: CountedOperation[]
}

export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
}

export interface Method {
  name: string
  contractName?: string
  selector: string
  signature: string
  count(calldata: string): Operation[]
}
