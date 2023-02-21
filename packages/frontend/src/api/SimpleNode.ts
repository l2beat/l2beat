import { ContractParameters } from './types'

interface SimpleNodeShared {
  id: string
  name: string
  discovered: boolean
  fields: {
    name: string
    connection?: string
  }[]
}

export interface ContractNode extends SimpleNodeShared {
  type: 'Contract'
  data: ContractParameters
}

export interface EOANode extends SimpleNodeShared {
  type: 'EOA'
  data: {
    address: string
  }
}
export interface UnknownNode extends SimpleNodeShared {
  type: 'Unknown'
}

export type SimpleNode = ContractNode | EOANode | UnknownNode
