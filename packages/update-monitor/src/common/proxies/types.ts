export interface ProxyDetection {
  upgradeability: UpgradeabilityParameters
  implementations: string[]
  relatives: string[]
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | EIP1967ProxyUpgradeability
  | StarkWareProxyUpgradeability
  | GnosisSafeUpgradeability
  | ProxyUpgradeability
  | ArbitrumProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface EIP1967ProxyUpgradeability {
  type: 'eip1967 proxy'
  admin: string
  implementation: string
}

export interface StarkWareProxyUpgradeability {
  type: 'StarkWare proxy'
  implementation: string
  callImplementation: string
  upgradeDelay: number
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
}

export interface ProxyUpgradeability {
  type: 'proxy'
  implementation: string
}

export interface ArbitrumProxyUpgradeability {
  type: 'arbitrum proxy'
  adminImplementation: string
  userImplementation: string
}
