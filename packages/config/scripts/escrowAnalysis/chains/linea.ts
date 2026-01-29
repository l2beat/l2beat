/**
 * Linea Stack Configuration
 *
 * Linea uses Consensys governance with:
 * - Linea Multisigs
 * - Timelock
 * - ProxyAdmin
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Linea governance addresses
const LINEA_GOVERNANCE = [
  'eth:0xF5058616517C068C7b8c7EbC69FF636Ade9066d6', // ProxyAdmin
  'eth:0xd6B95c960779c72B8C6752119849318E5d550574', // Timelock
  'eth:0x892bb7EeD71efB060ab90140e7825d8127991DD3', // Linea Multisig 1
  'eth:0xB8F5524D73f549Cf14A0587a3C7810723f9c0051', // Linea Multisig 2
]

/**
 * Get Linea stack configuration
 */
export function getLineaConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: LINEA_GOVERNANCE,
    rollupAdminName: 'Linea/Consensys Governance',
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Check if an address is a known Linea governance address
 */
export function isLineaGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return LINEA_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
