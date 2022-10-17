export interface ProjectParameters {
  name: string
  contracts: ContractParameters[]
}

export interface ContractParameters {
  name: string
  address: string
  upgradeability: UpgradeabilityParameters
  values: Record<string, ContractValue>
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | GnosisSafeUpgradeability
  | ProxyUpgradeability
  | CallProxyUpgradeability
  | ArbitrumProxyUpgradeability
  | EIP1967ProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
}

export interface ProxyUpgradeability {
  type: 'proxy'
  implementation: string
}

export interface CallProxyUpgradeability {
  type: 'call proxy'
  implementation: string
  callProxyImplementation: string
}

export interface ArbitrumProxyUpgradeability {
  type: 'arbitrum proxy'
  adminImplementation: string
  userImplementation: string
}

export interface EIP1967ProxyUpgradeability {
  type: 'eip1967 proxy'
  admin: string
  implementation: string
}

export type ContractValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[]
