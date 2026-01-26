/**
 * OP Stack Configuration
 *
 * Contains OP Stack-specific logic for escrow analysis including:
 * - Escrow discovery patterns
 * - Admin role identification
 * - Canonical bridge detection
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { ChainInfo } from './registry'
import type { EscrowConfig, StackConfig, Discovery } from './types'

const PROJECTS_DIR = join(__dirname, '../../../src/projects')

// Known OP Stack admin patterns
const OPSTACK_ADMIN_ENTRY_NAMES = new Set([
  'ProxyAdmin',
  'ProxyAdminOwner',
  'FoundationMultisig_1',
  'FoundationMultisig_2',
  'SecurityCouncilMultisig',
  'GuardianMultisig',
  'Challenger',
  'SystemOwnerSafe',
  'OwnerMultisig',
  'AdminMultisig',
  'OpFoundationOperationsSafe',
  'SuperchainProxyAdmin',
  'SuperchainProxyAdminOwner',
])

// Major OP Stack chain configurations
export const OPTIMISM_CONFIG = {
  projectId: 'optimism',
  rollupAdmins: [
    'eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04', // ProxyAdmin
    'eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A', // ProxyAdminOwner (Foundation Safe)
    'eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A', // Guardian
    'eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03', // SecurityCouncilMultisig
  ],
  rollupAdminName: 'Optimism Foundation',
  manualEscrows: [] as EscrowConfig[],
}

export const BASE_CONFIG = {
  projectId: 'base',
  rollupAdmins: [
    'eth:0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E', // ProxyAdmin
    'eth:0x9855054731540A48b28990B63DcF4f33d8AE46A1', // AdminMultisig (Base Multisig)
    'eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A', // Guardian
  ],
  rollupAdminName: 'Base/Coinbase',
  manualEscrows: [] as EscrowConfig[],
}

// Map of manually configured OP Stack chains
const MANUAL_OPSTACK_CONFIGS: Record<string, typeof OPTIMISM_CONFIG> = {
  optimism: OPTIMISM_CONFIG,
  base: BASE_CONFIG,
}

/**
 * Load discovery.json for a project
 */
function loadDiscovery(projectId: string): Discovery | null {
  const discoveryPath = join(PROJECTS_DIR, projectId, 'discovered.json')
  if (!existsSync(discoveryPath)) {
    return null
  }
  try {
    return JSON.parse(readFileSync(discoveryPath, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * Auto-detect rollup admin addresses from discovery
 */
function detectRollupAdmins(discovery: Discovery): string[] {
  const admins: string[] = []

  for (const entry of discovery.entries) {
    // Check if entry name matches known admin patterns
    if (entry.name && OPSTACK_ADMIN_ENTRY_NAMES.has(entry.name)) {
      admins.push(entry.address)
    }

    // Also check for ProxyAdmin pattern in name
    if (entry.name?.includes('ProxyAdmin') || entry.name?.includes('AdminMultisig')) {
      if (!admins.includes(entry.address)) {
        admins.push(entry.address)
      }
    }
  }

  return admins
}

/**
 * Get the rollup admin name from discovery
 */
function getRollupAdminName(discovery: Discovery, projectId: string): string {
  // Check for known governance patterns
  for (const entry of discovery.entries) {
    if (entry.name === 'FoundationMultisig_1' || entry.name === 'FoundationMultisig_2') {
      return 'Foundation Multisig'
    }
    if (entry.name === 'SecurityCouncilMultisig') {
      return 'Security Council'
    }
    if (entry.name === 'SystemOwnerSafe' || entry.name === 'OwnerMultisig') {
      return 'Owner Multisig'
    }
  }

  // Default to project name + governance
  return `${projectId} Governance`
}

/**
 * Get OP Stack specific configuration for a chain
 */
export function getOpStackConfig(chainInfo: ChainInfo): StackConfig {
  const { projectId } = chainInfo

  // Check for manual config first
  if (MANUAL_OPSTACK_CONFIGS[projectId]) {
    const config = MANUAL_OPSTACK_CONFIGS[projectId]
    return {
      projectId,
      hostChain: chainInfo.hostChain,
      rollupAdmins: config.rollupAdmins,
      rollupAdminName: config.rollupAdminName,
      escrows: config.manualEscrows,
      autoDetect: config.manualEscrows.length === 0,
    }
  }

  // Auto-detect from discovery
  const discovery = loadDiscovery(projectId)
  if (!discovery) {
    return {
      projectId,
      hostChain: chainInfo.hostChain,
      rollupAdmins: [],
      rollupAdminName: `${projectId} Governance`,
      escrows: [],
      autoDetect: true,
    }
  }

  const rollupAdmins = detectRollupAdmins(discovery)
  const rollupAdminName = getRollupAdminName(discovery, projectId)

  return {
    projectId,
    hostChain: chainInfo.hostChain,
    rollupAdmins,
    rollupAdminName,
    escrows: [],
    autoDetect: true,
  }
}

/**
 * Get known escrow admin for OP Stack escrows
 * (For escrows where admin isn't in discovery)
 */
export function getKnownOpStackEscrowAdmin(escrowAddress: string): string | null {
  const knownAdmins: Record<string, string> = {
    // Optimism L1StandardBridge
    '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1': 'eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
    // Base L1StandardBridge
    '0x3154cf16ccdb4c6d922629664174b904d80f2c35': 'eth:0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E',
  }

  const normalized = escrowAddress.toLowerCase().replace(/^eth:/, '')
  return knownAdmins[normalized] || null
}
