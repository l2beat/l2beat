export interface ProxyDetection {
  upgradeability: UpgradeabilityParameters
  implementations: string[]
  relatives: string[]
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | GnosisSafeUpgradeability
  | EIP1967ProxyUpgradeability
  | StarkWareProxyUpgradeability
  | ArbitrumProxyUpgradeability
  | GenericProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
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

export interface ArbitrumProxyUpgradeability {
  type: 'arbitrum proxy'
  admin: string
  adminImplementation: string
  userImplementation: string
}

export interface GenericProxyUpgradeability {
  type: 'generic proxy'
  implementation: string
}
