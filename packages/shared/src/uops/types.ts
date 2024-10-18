export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  name?: string
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
  to?: string
}

export interface Method {
  name?: string
  contractName?: string
  selector: string
  signature?: string
  count(calldata: string): Operation[]
}

export interface Transaction {
  data: string
  to?: string
}
