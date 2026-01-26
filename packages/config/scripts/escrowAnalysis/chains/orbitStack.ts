/**
 * Orbit Stack Configuration
 *
 * Contains Orbit-specific logic for escrow analysis including:
 * - Escrow discovery patterns
 * - Admin role identification
 * - Known issuer escrows
 * - Canonical bridge detection
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { ChainInfo } from './registry'
import type { EscrowConfig, StackConfig, Discovery } from './types'

const PROJECTS_DIR = join(__dirname, '../../../src/projects')

// Known Arbitrum-specific configurations
// These can be extended for other major Orbit chains

export const ARBITRUM_CONFIG = {
  projectId: 'arbitrum',
  rollupAdmins: [
    'eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa', // ProxyAdmin
    'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd', // UpgradeExecutor
    'eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD', // ProxyAdmin 2
    'eth:0x171a2624302775ef943f4f62e76fd22a6813d7c4', // Old Bridge ProxyAdmin
  ],
  rollupAdminName: 'Arbitrum DAO',
  manualEscrows: [
    {
      address: 'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
      name: 'Bridge',
      bridgeType: 'canonical' as const,
      description: 'Main Arbitrum bridge contract holding ETH and other assets.',
    },
    {
      address: 'eth:0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
      name: 'Old Bridge (Historical)',
      bridgeType: 'canonical' as const,
      description: 'Historical bridge escrow, still holds some ETH.',
    },
    {
      address: 'eth:0xcEe284F754E854890e311e3280b767F80797180d',
      name: 'Custom ERC20 Gateway',
      bridgeType: 'canonical' as const,
      description: 'Main entry point for users depositing ERC20 tokens that require minting custom tokens on L2.',
    },
    {
      address: 'eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
      name: 'Standard ERC20 Gateway',
      bridgeType: 'canonical' as const,
      description: 'Main entry point for users depositing ERC20 tokens.',
    },
    {
      address: 'eth:0xA10c7CE4b876998858b1a9E12b10092229539400',
      name: 'Maker/Sky DAI Vault',
      bridgeType: 'canonical' as const,
      description: 'Maker/Sky-controlled vault for DAI, USDS and sUSDS bridged with canonical messaging.',
    },
    {
      address: 'eth:0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
      name: 'Lido wstETH Vault',
      bridgeType: 'canonical' as const,
      description: 'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    },
    {
      address: 'eth:0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A',
      name: 'Livepeer LPT Vault',
      bridgeType: 'canonical' as const,
      description: 'LPT Vault for custom Livepeer Token Gateway.',
    },
  ],
}

export const NOVA_CONFIG: typeof ARBITRUM_CONFIG = {
  projectId: 'nova',
  rollupAdmins: [
    // Nova's ProxyAdmins (owned by UpgradeExecutor, controlled by Arbitrum DAO)
    'eth:0x71D78dC7cCC0e037e12de1E50f5470903ce37148', // ProxyAdmin (Bridge admin)
    'eth:0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560', // ProxyAdmin 3 (ERC20Gateway, CustomGateway admin)
    'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd', // UpgradeExecutor
  ],
  rollupAdminName: 'Arbitrum DAO',
  manualEscrows: [], // Nova escrows are auto-detected
}

// Map of manually configured Orbit chains
const MANUAL_ORBIT_CONFIGS: Record<string, typeof ARBITRUM_CONFIG> = {
  arbitrum: ARBITRUM_CONFIG,
  nova: NOVA_CONFIG,
}

// Known Orbit admin entry names (for auto-detection)
const ROLLUP_ADMIN_ENTRY_NAMES = new Set([
  'UpgradeExecutor',
  'ProxyAdmin',
  'ProxyAdmin 2',
  'Timelock',
  'L2Timelock',
  'SecurityCouncil',
])

// Known Orbit admin templates (for auto-detection)
const ROLLUP_ADMIN_TEMPLATES = new Set([
  'orbitstack/UpgradeExecutor',
  'global/ProxyAdmin',
])

// Known issuer-controlled escrow templates
const ISSUER_ESCROW_TEMPLATES: Record<string, string> = {
  'circle/L1OrbitUSDCGateway': 'Circle',
  'maker/L1Escrow': 'MakerDAO',
}

// Known external escrow admins (for issuer-secured detection)
const EXTERNAL_ADMINS: Record<string, string> = {
  'eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c': 'Lido DAO',
  'eth:0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB': 'MakerDAO',
  'eth:0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58': 'MakerDAO',
}

// Known issuer-controlled escrow addresses
const KNOWN_ISSUER_ESCROWS: Record<string, string> = {
  'eth:0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A': 'Livepeer', // LPT L1 Escrow
}

// Known escrow admins for escrows not in discovery
const KNOWN_ESCROW_ADMINS: Record<string, string> = {
  'eth:0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515': 'eth:0x171a2624302775ef943f4f62e76fd22a6813d7c4',
}

/**
 * Load discovery.json for a project
 */
function loadDiscovery(projectId: string): Discovery | null {
  const discoveryPath = join(PROJECTS_DIR, projectId, 'discovered.json')
  try {
    const content = readFileSync(discoveryPath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Extract rollup admins from discovery data
 */
function extractRollupAdmins(discovery: Discovery): string[] {
  const admins = new Set<string>()

  for (const entry of discovery.entries) {
    // Check by name
    if (entry.name && ROLLUP_ADMIN_ENTRY_NAMES.has(entry.name)) {
      admins.add(entry.address)
      continue
    }
    // Check by template
    if (entry.template && ROLLUP_ADMIN_TEMPLATES.has(entry.template)) {
      admins.add(entry.address)
    }
  }

  return Array.from(admins)
}

/**
 * Find the main Bridge escrow from discovery
 */
function findBridgeEscrow(discovery: Discovery): EscrowConfig | null {
  const bridgeEntry = discovery.entries.find(
    (e) =>
      e.template === 'orbitstack/Bridge' ||
      (e.name === 'Bridge' && e.type === 'Contract'),
  )

  if (!bridgeEntry) return null

  const chain = discovery.chain || 'ethereum'
  const chainPrefix = chain === 'ethereum' ? 'eth' : chain.slice(0, 4)

  return {
    address: `${chainPrefix}:${bridgeEntry.address}`,
    name: 'Bridge',
    bridgeType: 'canonical',
    description: bridgeEntry.description || 'Main bridge contract.',
  }
}

/**
 * Find ERC20 gateway escrows from discovery
 */
function findGatewayEscrows(discovery: Discovery): EscrowConfig[] {
  const escrows: EscrowConfig[] = []
  const chain = discovery.chain || 'ethereum'
  const chainPrefix = chain === 'ethereum' ? 'eth' : chain.slice(0, 4)

  for (const entry of discovery.entries) {
    // Standard ERC20 Gateway
    if (
      entry.template === 'orbitstack/L1ERC20Gateway' ||
      (entry.name && entry.name.includes('ERC20Gateway'))
    ) {
      escrows.push({
        address: `${chainPrefix}:${entry.address}`,
        name: entry.name || 'ERC20 Gateway',
        bridgeType: 'canonical',
        description: entry.description || 'ERC20 token gateway.',
      })
    }

    // Custom token gateways (issuer-controlled)
    if (entry.template && ISSUER_ESCROW_TEMPLATES[entry.template]) {
      const issuer = ISSUER_ESCROW_TEMPLATES[entry.template]
      escrows.push({
        address: `${chainPrefix}:${entry.address}`,
        name: entry.name || `${issuer} Gateway`,
        bridgeType: 'canonical', // Uses canonical messaging
        description: entry.description || `Custom gateway controlled by ${issuer}.`,
      })
    }
  }

  return escrows
}

/**
 * Get Orbit stack configuration for a chain
 */
export function getOrbitStackConfig(chainInfo: ChainInfo): StackConfig {
  const { projectId, hostChain } = chainInfo

  // Check for manual configuration first
  const manualConfig = MANUAL_ORBIT_CONFIGS[projectId]
  if (manualConfig?.manualEscrows && manualConfig.manualEscrows.length > 0) {
    return {
      projectId,
      hostChain,
      rollupAdmins: manualConfig.rollupAdmins,
      rollupAdminName: manualConfig.rollupAdminName,
      escrows: manualConfig.manualEscrows,
      autoDetect: false,
    }
  }

  // Auto-detect from discovery
  const discovery = loadDiscovery(projectId)
  if (!discovery) {
    return {
      projectId,
      hostChain,
      rollupAdmins: [],
      rollupAdminName: 'Rollup Governance',
      escrows: [],
      autoDetect: true,
    }
  }

  const rollupAdmins = manualConfig?.rollupAdmins ?? extractRollupAdmins(discovery)
  const rollupAdminName = manualConfig?.rollupAdminName ?? 'Rollup Governance'

  // Build escrow list
  const escrows: EscrowConfig[] = []

  // Find main Bridge
  const bridgeEscrow = findBridgeEscrow(discovery)
  if (bridgeEscrow) {
    escrows.push(bridgeEscrow)
  }

  // Find gateway escrows
  const gatewayEscrows = findGatewayEscrows(discovery)
  escrows.push(...gatewayEscrows)

  return {
    projectId,
    hostChain,
    rollupAdmins,
    rollupAdminName,
    escrows,
    autoDetect: true,
  }
}

/**
 * Check if an escrow is issuer-controlled
 */
export function isIssuerControlledEscrow(
  escrowAddress: string,
  template?: string,
): { isIssuerControlled: boolean; issuer: string | null } {
  // Check template
  if (template && ISSUER_ESCROW_TEMPLATES[template]) {
    return {
      isIssuerControlled: true,
      issuer: ISSUER_ESCROW_TEMPLATES[template],
    }
  }

  // Check known issuer escrows by address
  const normalizedAddress = escrowAddress.toLowerCase()
  for (const [address, issuer] of Object.entries(KNOWN_ISSUER_ESCROWS)) {
    if (address.toLowerCase() === normalizedAddress) {
      return { isIssuerControlled: true, issuer }
    }
  }

  return { isIssuerControlled: false, issuer: null }
}

/**
 * Get admin name from address
 */
export function getExternalAdminName(adminAddress: string): string | null {
  const normalized = adminAddress.toLowerCase()
  for (const [address, name] of Object.entries(EXTERNAL_ADMINS)) {
    if (address.toLowerCase() === normalized) {
      return name
    }
  }
  return null
}

/**
 * Get known escrow admin for escrows not in discovery
 */
export function getKnownEscrowAdmin(escrowAddress: string): string | null {
  const normalized = escrowAddress.toLowerCase()
  for (const [address, admin] of Object.entries(KNOWN_ESCROW_ADMINS)) {
    if (address.toLowerCase() === normalized) {
      return admin
    }
  }
  return null
}

export { EXTERNAL_ADMINS, KNOWN_ISSUER_ESCROWS, ISSUER_ESCROW_TEMPLATES }
