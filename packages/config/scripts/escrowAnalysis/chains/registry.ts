/**
 * Chain Registry
 *
 * Central registry for identifying and loading chain configurations.
 * Supports different chain stacks (Orbit, OP Stack, etc.) with
 * stack-specific analysis logic.
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export type ChainStack = 'orbit' | 'opstack' | 'zkstack' | 'polygon' | 'starknet' | 'unknown'
export type ChainType = 'layer2' | 'layer3'

export interface ChainInfo {
  projectId: string
  stack: ChainStack
  type: ChainType
  hostChain: string // 'ethereum' for L2s, or parent chain for L3s
  hasDiscovery: boolean
  hasTvsConfig: boolean
  isArchived: boolean
}

interface DiscoveryJson {
  name: string
  chain?: string
  entries: Array<{
    address: string
    name?: string
    template?: string
    type: string
  }>
}

const PROJECTS_DIR = join(__dirname, '../../../src/projects')
const TVS_DIR = join(__dirname, '../../../src/tvs/json')

// Templates that identify Orbit chains
const ORBIT_TEMPLATES = [
  'orbitstack/UpgradeExecutor',
  'orbitstack/RollupProxy',
  'orbitstack/SequencerInbox',
  'orbitstack/Bridge',
]

// Templates that identify OP Stack chains
const OPSTACK_TEMPLATES = [
  'opstack/OptimismPortal',
  'opstack/L1StandardBridge',
  'opstack/SystemConfig',
]

// Templates that identify zkSync/ZK Stack chains
const ZKSTACK_TEMPLATES = [
  'zkstack/StateTransitionManager',
  'zkstack/ValidatorTimelock',
  'shared-zk-stack/Diamond',
  'shared-zk-stack/BridgeHub',
  'shared-zk-stack/ValidatorTimelock_post29',
]

// Templates that identify Polygon chains
const POLYGON_TEMPLATES = [
  'polygoncdkstack/RollupManager',
  'polygoncdkstack/PolygonRollupManager',
]

// Templates that identify Starknet
const STARKNET_TEMPLATES = [
  'starknet/StarknetEthBridge',
  'starknet/StarkgateManager',
  'starknet/StarkgateRegistry',
  'starknet/LordsL1Bridge',
]

/**
 * Detect the chain stack from discovery.json templates
 */
function detectStack(discovery: DiscoveryJson): ChainStack {
  const templates = new Set<string>()

  for (const entry of discovery.entries) {
    if (entry.template) {
      templates.add(entry.template)
    }
  }

  // Check each stack's templates
  if (ORBIT_TEMPLATES.some((t) => templates.has(t))) {
    return 'orbit'
  }
  if (OPSTACK_TEMPLATES.some((t) => templates.has(t))) {
    return 'opstack'
  }
  if (ZKSTACK_TEMPLATES.some((t) => templates.has(t))) {
    return 'zkstack'
  }
  if (POLYGON_TEMPLATES.some((t) => templates.has(t))) {
    return 'polygon'
  }
  if (STARKNET_TEMPLATES.some((t) => templates.has(t))) {
    return 'starknet'
  }

  return 'unknown'
}

/**
 * Detect if chain is L2 or L3 from discovery chain field
 */
function detectChainType(discovery: DiscoveryJson): {
  type: ChainType
  hostChain: string
} {
  const chain = discovery.chain || 'ethereum'

  // L3s have a non-ethereum host chain
  if (chain !== 'ethereum') {
    return { type: 'layer3', hostChain: chain }
  }

  return { type: 'layer2', hostChain: 'ethereum' }
}

/**
 * Get all project directories that have discovered.json
 */
function getProjectsWithDiscovery(): string[] {
  const projectDirs = readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  return projectDirs.filter((dir) => {
    const discoveryPath = join(PROJECTS_DIR, dir, 'discovered.json')
    return existsSync(discoveryPath)
  })
}

/**
 * Load discovery.json for a project
 */
function loadDiscovery(projectId: string): DiscoveryJson | null {
  const discoveryPath = join(PROJECTS_DIR, projectId, 'discovered.json')
  if (!existsSync(discoveryPath)) {
    return null
  }

  try {
    const content = readFileSync(discoveryPath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Check if TVS config exists for a project
 */
function hasTvsConfig(projectId: string): boolean {
  const tvsPath = join(TVS_DIR, `${projectId}.json`)
  return existsSync(tvsPath)
}

/**
 * Check if a project is archived by looking for archivedAt in its config files
 */
function isProjectArchived(projectId: string): boolean {
  const projectDir = join(PROJECTS_DIR, projectId)

  // Check common config file patterns
  const configFiles = [
    join(projectDir, `${projectId}.ts`),
    join(projectDir, 'index.ts'),
  ]

  for (const configFile of configFiles) {
    if (existsSync(configFile)) {
      try {
        const content = readFileSync(configFile, 'utf-8')
        if (content.includes('archivedAt:') || content.includes('archivedAt :')) {
          return true
        }
      } catch {
        // Ignore read errors
      }
    }
  }

  return false
}

/**
 * Build the chain registry by scanning all projects
 */
export function buildChainRegistry(): Map<string, ChainInfo> {
  const registry = new Map<string, ChainInfo>()
  const projectIds = getProjectsWithDiscovery()

  for (const projectId of projectIds) {
    const discovery = loadDiscovery(projectId)
    if (!discovery) continue

    const stack = detectStack(discovery)
    const { type, hostChain } = detectChainType(discovery)

    registry.set(projectId, {
      projectId,
      stack,
      type,
      hostChain,
      hasDiscovery: true,
      hasTvsConfig: hasTvsConfig(projectId),
      isArchived: isProjectArchived(projectId),
    })
  }

  return registry
}

/**
 * Get all chains of a specific stack (excludes archived by default)
 */
export function getChainsByStack(
  registry: Map<string, ChainInfo>,
  stack: ChainStack,
  includeArchived = false,
): ChainInfo[] {
  return Array.from(registry.values()).filter(
    (chain) => chain.stack === stack && (includeArchived || !chain.isArchived)
  )
}

/**
 * Get all active (non-archived) chains
 */
export function getActiveChains(registry: Map<string, ChainInfo>): ChainInfo[] {
  return Array.from(registry.values()).filter((chain) => !chain.isArchived)
}

/**
 * Get all L2 chains
 */
export function getL2Chains(registry: Map<string, ChainInfo>): ChainInfo[] {
  return Array.from(registry.values()).filter((chain) => chain.type === 'layer2')
}

/**
 * Get all L3 chains
 */
export function getL3Chains(registry: Map<string, ChainInfo>): ChainInfo[] {
  return Array.from(registry.values()).filter((chain) => chain.type === 'layer3')
}

/**
 * Get chains that have TVS data (can be analyzed for TVL)
 */
export function getChainsWithTvs(registry: Map<string, ChainInfo>): ChainInfo[] {
  return Array.from(registry.values()).filter((chain) => chain.hasTvsConfig)
}

/**
 * Print registry summary
 */
export function printRegistrySummary(registry: Map<string, ChainInfo>): void {
  const byStack = new Map<ChainStack, ChainInfo[]>()

  for (const chain of registry.values()) {
    if (!byStack.has(chain.stack)) {
      byStack.set(chain.stack, [])
    }
    byStack.get(chain.stack)!.push(chain)
  }

  console.log('\n=== Chain Registry Summary ===')
  console.log(`Total projects with discovery: ${registry.size}`)

  for (const [stack, chains] of byStack.entries()) {
    const l2Count = chains.filter((c) => c.type === 'layer2').length
    const l3Count = chains.filter((c) => c.type === 'layer3').length
    const withTvs = chains.filter((c) => c.hasTvsConfig).length
    console.log(`\n${stack.toUpperCase()}:`)
    console.log(`  Total: ${chains.length} (${l2Count} L2s, ${l3Count} L3s)`)
    console.log(`  With TVS config: ${withTvs}`)
  }
}
