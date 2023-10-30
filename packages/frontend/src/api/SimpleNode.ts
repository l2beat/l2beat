import { ContractParameters } from '@l2beat/discovery-types'

interface SimpleNodeShared {
  id: string
  name: string
  discovered: boolean
  fields: {
    name: string
    connection?: string // id
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

export type SimpleNode = EOANode | UnknownNode | ContractNode
