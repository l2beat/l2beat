import { DiscoveryContract, DiscoveryEoa } from './paseDiscovery'

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
  data: DiscoveryContract
}

export interface EOANode extends SimpleNodeShared {
  type: 'EOA'
  data: DiscoveryEoa
}
export interface UnknownNode extends SimpleNodeShared {
  type: 'Unknown'
}

export type SimpleNode = EOANode | UnknownNode | ContractNode
