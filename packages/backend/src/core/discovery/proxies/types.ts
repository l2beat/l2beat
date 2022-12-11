import { EthereumAddress } from '@l2beat/types'
import * as z from 'zod'

export interface ProxyDetection {
  upgradeability: UpgradeabilityParameters
  implementations: EthereumAddress[]
  relatives: EthereumAddress[]
}

export type ManualProxyType = z.infer<typeof ManualProxyType>
export const ManualProxyType = z.enum([
  'new Arbitrum proxy',
  'call implementation proxy',
])

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

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
  masterCopy: EthereumAddress
}

export interface EIP1967ProxyUpgradeability {
  type: 'EIP1967 proxy'
  admin: EthereumAddress
  implementation: EthereumAddress
}

export interface ZeppelinOSProxyUpgradeability {
  type: 'ZeppelinOS proxy'
  admin?: EthereumAddress
  owner?: EthereumAddress
  implementation: EthereumAddress
}

export interface StarkWareProxyUpgradeability {
  type: 'StarkWare proxy'
  implementation: EthereumAddress
  callImplementation: EthereumAddress
  upgradeDelay: number
  isFinal: boolean
}

export interface StarkWareDiamondUpgradeability {
  type: 'StarkWare diamond'
  implementation: EthereumAddress
  upgradeDelay: number
  isFinal: boolean
  facets: Record<string, EthereumAddress>
}

export interface ArbitrumProxyUpgradeability {
  type: 'Arbitrum proxy'
  admin: EthereumAddress
  adminImplementation: EthereumAddress
  userImplementation: EthereumAddress
}

export interface NewArbitrumProxyUpgradeability {
  type: 'new Arbitrum proxy'
  admin: EthereumAddress
  implementation: EthereumAddress
  adminImplementation: EthereumAddress
  userImplementation: EthereumAddress
}

export interface ResolvedDelegateProxyUpgradeability {
  type: 'resolved delegate proxy'
  addressManager: EthereumAddress
  implementationName: string
  implementation: EthereumAddress
}

export interface EIP897ProxyUpgradeability {
  type: 'EIP897 proxy'
  isUpgradable: boolean
  implementation: EthereumAddress
}

export interface CallImplementationProxyUpgradeability {
  type: 'call implementation proxy'
  implementation: EthereumAddress
}
