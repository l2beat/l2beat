/**
 * Morph Stack Configuration
 *
 * Morph uses governance with:
 * - Morph Multisigs
 * - ProxyAdmin
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Morph governance addresses
const MORPH_GOVERNANCE = [
  'eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0', // ProxyAdmin
  'eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887', // Morph Multisig 1
  'eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377', // Morph Multisig 2
]

/**
 * Get Morph stack configuration
 */
export function getMorphConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: MORPH_GOVERNANCE,
    rollupAdminName: 'Morph Governance',
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Check if an address is a known Morph governance address
 */
export function isMorphGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return MORPH_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
