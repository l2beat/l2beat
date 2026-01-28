/**
 * ZK Stack Configuration
 *
 * ZK Stack (zkSync Era and related chains) uses:
 * - ProxyAdmin for contract upgrades
 * - EraChainAdminProxy
 * - Cross-chain governance via gateway
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// ZK Stack governance addresses (zkSync Era)
const ZKSYNC_ERA_GOVERNANCE = [
  'eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1', // ProxyAdmin
  'eth:0x2cf3bD6a9056b39999F3883955E183F655345063', // EraChainAdminProxy
  'eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E', // Matter Labs Multisig
  'eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828', // ValidatorTimeLock
]

/**
 * Get ZK Stack configuration
 */
export function getZkStackConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: ZKSYNC_ERA_GOVERNANCE,
    rollupAdminName: 'ZKsync Governance',
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Check if an address is a known ZK Stack governance address
 */
export function isZkStackGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return ZKSYNC_ERA_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
