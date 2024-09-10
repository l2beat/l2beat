import type { DiscoveryContract, DiscoveryEoa } from './paseDiscovery'

interface SimpleNodeShared {
  id: string
  name: string
  proxyType?: string
  discovered: boolean
  fields: {
    name: string
    connection?: string // id
  }[]
}

export interface ContractNode extends SimpleNodeShared {
  type: 'Contract'
  data: DiscoveryContract
  chain: string
}

export interface EOANode extends SimpleNodeShared {
  type: 'EOA'
  data: DiscoveryEoa
  chain: string
}
export interface UnknownNode extends SimpleNodeShared {
  type: 'Unknown'
  chain: string
}

export type SimpleNode = EOANode | UnknownNode | ContractNode
