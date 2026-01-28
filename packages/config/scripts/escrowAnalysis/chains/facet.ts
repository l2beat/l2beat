/**
 * Facet Configuration
 *
 * Facet is a ZK rollup using SP1 proofs.
 * - L1Bridge is immutable and relies on the Rollup contract
 * - Rollup is controlled by Facet Multisig (2/3)
 * - L1Bridge trust = Rollup trust (no additional trust)
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Facet governance addresses
const FACET_GOVERNANCE = [
  'eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525', // Facet Multisig (2/3)
]

/**
 * Get Facet configuration
 */
export function getFacetConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: FACET_GOVERNANCE,
    rollupAdminName: 'Facet Multisig',
    escrows: [],
    autoDetect: true,
  }
}
