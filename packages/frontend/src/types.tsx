export interface ProjectParameters {
  name: string
  blockNumber: number
  contracts: ContractParameters[]
  eoas: string[]
  abis: Record<string, string[]>
}

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue }

export interface ContractParameters {
  name: string
  unverified?: true
  address: string
  code?: string
  upgradeability: UpgradeabilityParameters
  values?: Record<string, ContractValue>
  errors?: Record<string, string>
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | GnosisSafeUpgradeability
  | EIP1967ProxyUpgradeability
  | ZeppelinOSProxyUpgradeability
  | StarkWareProxyUpgradeability
  | StarkWareDiamondUpgradeability
  | ArbitrumProxyUpgradeability
  | NewArbitrumProxyUpgradeability
  | ResolvedDelegateProxyUpgradeability
  | EIP897ProxyUpgradeability
  | CallImplementationProxyUpgradeability
  | EIP2535ProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
  masterCopy: string
}

export interface EIP1967ProxyUpgradeability {
  type: 'EIP1967 proxy'
  admin: string
  implementation: string
}

export interface ZeppelinOSProxyUpgradeability {
  type: 'ZeppelinOS proxy'
  admin?: string
  owner?: string
  implementation: string
}

export interface StarkWareProxyUpgradeability {
  type: 'StarkWare proxy'
  implementation: string
  callImplementation: string
  upgradeDelay: number
  isFinal: boolean
}

export interface StarkWareDiamondUpgradeability {
  type: 'StarkWare diamond'
  implementation: string
  upgradeDelay: number
  isFinal: boolean
  facets: Record<string, string>
}

export interface ArbitrumProxyUpgradeability {
  type: 'Arbitrum proxy'
  admin: string
  adminImplementation: string
  userImplementation: string
}

export interface NewArbitrumProxyUpgradeability {
  type: 'new Arbitrum proxy'
  admin: string
  implementation: string
  adminImplementation: string
  userImplementation: string
}

export interface ResolvedDelegateProxyUpgradeability {
  type: 'resolved delegate proxy'
  addressManager: string
  implementationName: string
  implementation: string
}

export interface EIP897ProxyUpgradeability {
  type: 'EIP897 proxy'
  isUpgradable: boolean
  implementation: string
}

export interface CallImplementationProxyUpgradeability {
  type: 'call implementation proxy'
  implementation: string
}

export interface EIP2535ProxyUpgradeability {
  type: 'EIP2535 diamond proxy'
  facets: string[]
}
