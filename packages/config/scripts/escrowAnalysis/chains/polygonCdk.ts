/**
 * Polygon CDK / AggLayer Configuration
 *
 * AggLayer chains use a shared bridge infrastructure:
 * - AgglayerBridge is controlled by Polygon/AggLayer governance
 * - Individual rollups don't control the bridge
 * - This means canonical messaging goes through a shared third-party bridge
 */

import type { ChainInfo } from './registry'
import type { StackConfig } from './types'

// Polygon CDK / AggLayer governance addresses
const AGGLAYER_GOVERNANCE = [
  'eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A', // SharedProxyAdmin
  'eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21', // Polygon Multisig (SecurityCouncil)
]

// Known AggLayer escrows
const AGGLAYER_ESCROWS = [
  {
    address: 'eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
    name: 'AgglayerBridge',
    description: 'Shared AggLayer bridge escrow for all AggLayer chains. Controlled by Polygon/AggLayer governance.',
    admin: 'eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A', // SharedProxyAdmin
    adminName: 'Polygon/AggLayer',
  },
]

/**
 * Get Polygon CDK / AggLayer configuration
 *
 * Note: AggLayer is controlled by Polygon, not by individual rollups.
 * So from a rollup's perspective (e.g., Katana), AggLayer is third-party.
 * We don't add AGGLAYER_GOVERNANCE to rollupAdmins because that would
 * incorrectly classify it as "trust-minimized".
 */
export function getPolygonCdkConfig(chainInfo: ChainInfo): StackConfig {
  return {
    projectId: chainInfo.projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins: [], // Empty - Polygon governance is NOT the rollup's governance
    rollupAdminName: 'Rollup Governance',
    escrows: AGGLAYER_ESCROWS,
    autoDetect: true,
  }
}

/**
 * Check if an address is a known AggLayer governance address
 */
export function isAggLayerGovernance(address: string): boolean {
  const normalized = address.toLowerCase()
  return AGGLAYER_GOVERNANCE.some(
    (admin) => admin.toLowerCase() === normalized || admin.toLowerCase().endsWith(normalized)
  )
}
