/**
 * Starknet Stack Configuration
 *
 * Starknet uses a different governance model with:
 * - Starkware Security Council
 * - DelayedExecutor for upgrades
 * - Various Starkware Multisigs
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Starknet governance addresses
const STARKNET_GOVERNANCE = [
  'eth:0x15e8c684FD095d4796A0c0CF678554F4c1C7C361', // Starkware Security Council
  'eth:0xCA112018fEB729458b628AadC8f996f9deCbCa0c', // DelayedExecutor
  'eth:0x83C0A700114101D1283D1405E2c8f21D3F03e988', // Starkware Multisig 1
  'eth:0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec', // Starkware Multisig 2
  'eth:0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5', // Starkware Multisig 4
]

/**
 * Get Starknet stack configuration
 */
export function getStarknetConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: STARKNET_GOVERNANCE,
    rollupAdminName: 'Starkware Governance',
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Check if an address is a known Starknet governance address
 */
export function isStarknetGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return STARKNET_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
