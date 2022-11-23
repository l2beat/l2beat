import { EthereumAddress } from '@l2beat/types'

export interface ProxyDetection {
  upgradeability: UpgradeabilityParameters
  implementations: EthereumAddress[]
  relatives: EthereumAddress[]
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
  admin: EthereumAddress
  implementation: EthereumAddress
}

export interface StarkWareProxyUpgradeability {
  type: 'StarkWare proxy'
  implementation: EthereumAddress
  callImplementation: EthereumAddress
  upgradeDelay: number
}

export interface ArbitrumProxyUpgradeability {
  type: 'arbitrum proxy'
  admin: EthereumAddress
  adminImplementation: EthereumAddress
  userImplementation: EthereumAddress
}

export interface EIP897ProxyUpgradeability {
  type: 'EIP897 proxy'
  isUpgradable: boolean
  implementation: EthereumAddress
}

export interface CustomProxyUpgradeability {
  type: 'custom proxy'
  implementation: EthereumAddress
}
