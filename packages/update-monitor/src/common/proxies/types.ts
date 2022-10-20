export interface ProxyDetection {
  upgradeability: UpgradeabilityParameters
  implementations: string[]
  relatives: string[]
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | EIP1967ProxyUpgradeability
  | StarkWare2019ProxyUpgradeability
  | GnosisSafeUpgradeability
  | ProxyUpgradeability
  | CallProxyUpgradeability
  | ArbitrumProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface EIP1967ProxyUpgradeability {
  type: 'eip1967 proxy'
  admin: string
  implementation: string
}

export interface StarkWare2019ProxyUpgradeability {
  type: 'StarkWare2019 proxy'
  implementation: string
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
