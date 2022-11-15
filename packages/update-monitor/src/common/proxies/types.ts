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
  | EIP897ProxyUpgradeability
  | CustomProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
}

export interface EIP1967ProxyUpgradeability {
  type: 'EIP1967 proxy'
  admin: string
  implementation: string
}

export interface StarkWareProxyUpgradeability {
  type: 'StarkWare proxy'
  implementation: string
  callImplementation: string
  upgradeDelay: number
  isFinal: boolean
}

export interface ArbitrumProxyUpgradeability {
  type: 'arbitrum proxy'
  admin: string
  adminImplementation: string
  userImplementation: string
}

export interface EIP897ProxyUpgradeability {
  type: 'EIP897 proxy'
  isUpgradable: boolean
  implementation: string
}

export interface CustomProxyUpgradeability {
  type: 'custom proxy'
  implementations: string[]
}
