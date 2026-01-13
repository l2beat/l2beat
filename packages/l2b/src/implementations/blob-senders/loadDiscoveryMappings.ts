import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { receiverMapping as STATIC_RECEIVER_MAPPING } from '../find-l2/BlobsFetcher'

interface SequencerInfo {
  project: string
  name?: string
  role?: string
}

export type SequencerMapping = Map<string, SequencerInfo>
export type ReceiverMapping = Record<string, string>

interface ContractInfo {
  project: string
  name: string
}

export type ContractMapping = Map<string, ContractInfo>

interface DiscoveryMappings {
  sequencers: SequencerMapping
  receivers: ReceiverMapping
  contracts: ContractMapping
}

// Permission types that indicate blob-posting/sequencing roles
const SEQUENCER_PERMISSIONS = [
  'sequence',
  'operateStarknet',
  'operateStarkEx',
  'operateLinea',
  'validate',
  'validateZkStack',
  'propose',
]

// Roles that indicate validator/sequencer activity (for 'interact' permissions)
const VALIDATOR_ROLES = ['.validatorVTL', '.validators']

// Value fields that contain sequencer/batcher addresses
const SEQUENCER_VALUE_FIELDS = [
  'batcherHash',
  'BATCHER',
  'batcher',
  'sequencer',
  'Sequencer',
  'operator',
  'Operator',
  // Kailua/dispute game fields
  'proposer',
  'vanguard',
]

// Array value fields that contain multiple sequencer addresses
const SEQUENCER_ARRAY_FIELDS = [
  'batchPosters',
  'sequencers',
  'operators',
  'batchers',
  'validators',
]

// Fields that contain inbox addresses
const INBOX_FIELDS = [
  'batchInbox',
  'sequencerInbox',
  'BatchInbox',
  'SequencerInbox',
  'BATCH_INBOX',
]

// Known non-L2 contracts that receive blobs (auto-dismissed as not L2s)
// Note: Keep this minimal - only add contracts that are DEFINITIVELY not L2-related
export const NON_L2_RECEIVERS: Record<string, string> = {}

// Well-known contracts for display labeling only (NOT auto-dismissed)
// These still require investigation as some L2s may use them
export const KNOWN_UTILITY_CONTRACTS: Record<string, string> = {
  '0xca11bde05977b3631167028862be2a173976ca11': 'Multicall3',
}

function findDiscoveredJsonFiles(dir: string): string[] {
  const results: string[] = []
  try {
    const items = readdirSync(dir)
    for (const item of items) {
      const fullPath = join(dir, item)
      try {
        const stat = statSync(fullPath)
        if (stat.isDirectory()) {
          results.push(...findDiscoveredJsonFiles(fullPath))
        } else if (item === 'discovered.json') {
          results.push(fullPath)
        }
      } catch {
        // Skip inaccessible paths
      }
    }
  } catch {
    // Skip inaccessible directories
  }
  return results
}

function normalizeAddress(address: string): string | null {
  if (address.startsWith('eth:')) {
    return address.replace('eth:', '').toLowerCase()
  }
  if (address.startsWith('0x') && address.length === 42) {
    return address.toLowerCase()
  }
  return null
}

// Single-pass loader for sequencer, receiver, and contract mappings
export function loadDiscoveryMappings(projectsPath: string): DiscoveryMappings {
  const sequencers: SequencerMapping = new Map()
  const receivers: ReceiverMapping = { ...STATIC_RECEIVER_MAPPING }
  const contracts: ContractMapping = new Map()

  const files = findDiscoveredJsonFiles(projectsPath)

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8')
      const data = JSON.parse(content)
      const projectName = data.name

      for (const entry of data.entries || []) {
        // Extract contract names (eth: addresses only)
        if (entry.address?.startsWith('eth:') && entry.name) {
          const address = normalizeAddress(entry.address)
          if (address && !contracts.has(address)) {
            contracts.set(address, {
              project: projectName,
              name: entry.name,
            })
          }
        }

        // Extract sequencers from permissions (eth: addresses only)
        if (entry.address?.startsWith('eth:')) {
          const sequencerPerms = entry.receivedPermissions?.filter(
            (p: { permission: string; role?: string }) =>
              SEQUENCER_PERMISSIONS.includes(p.permission) ||
              (p.permission === 'interact' &&
                p.role &&
                VALIDATOR_ROLES.includes(p.role)),
          )
          if (sequencerPerms && sequencerPerms.length > 0) {
            const address = normalizeAddress(entry.address)
            if (address && !sequencers.has(address)) {
              sequencers.set(address, {
                project: projectName,
                name: entry.name,
                role: sequencerPerms[0].role || sequencerPerms[0].permission,
              })
            }
          }
        }

        const values = entry.values
        if (!values) continue

        // Extract sequencers from value fields
        for (const field of SEQUENCER_VALUE_FIELDS) {
          const value = values[field]
          if (typeof value === 'string') {
            const address = normalizeAddress(value)
            if (address && !sequencers.has(address)) {
              sequencers.set(address, {
                project: projectName,
                name: `${field} (from ${entry.name || entry.address})`,
                role: `.${field}`,
              })
            }
          }
        }

        // Extract sequencers from array fields
        for (const field of SEQUENCER_ARRAY_FIELDS) {
          const arr = values[field]
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (typeof item === 'string') {
                const address = normalizeAddress(item)
                if (address && !sequencers.has(address)) {
                  sequencers.set(address, {
                    project: projectName,
                    name: `${field} (from ${entry.name || entry.address})`,
                    role: `.${field}`,
                  })
                }
              }
            }
          }
        }

        // Extract inbox addresses
        for (const field of INBOX_FIELDS) {
          const value = values[field]
          if (typeof value === 'string') {
            const address = normalizeAddress(value)
            if (address && !receivers[address]) {
              receivers[address] = projectName
            }
          }
        }
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return { sequencers, receivers, contracts }
}

// Cached mappings
let cachedMappings: DiscoveryMappings | null = null

export function initMappings(projectsPath: string): DiscoveryMappings {
  cachedMappings = loadDiscoveryMappings(projectsPath)
  return cachedMappings
}

export function getSequencerMapping(): SequencerMapping {
  return cachedMappings?.sequencers ?? new Map()
}

export function getReceiverMapping(): ReceiverMapping {
  return cachedMappings?.receivers ?? STATIC_RECEIVER_MAPPING
}

export function getProjectByReceiver(receiver: string): string | undefined {
  const mapping = cachedMappings?.receivers ?? STATIC_RECEIVER_MAPPING
  return mapping[receiver.toLowerCase()]
}

export function getReceiverName(receiver: string): string | undefined {
  const lower = receiver.toLowerCase()
  const project =
    cachedMappings?.receivers?.[lower] ?? STATIC_RECEIVER_MAPPING[lower]
  if (project) return project
  // Check utility contracts for display labeling (but these are NOT auto-dismissed)
  const utilityName = KNOWN_UTILITY_CONTRACTS[lower]
  if (utilityName) return utilityName
  return NON_L2_RECEIVERS[lower]
}

export function isNonL2Receiver(receiver: string): boolean {
  return receiver.toLowerCase() in NON_L2_RECEIVERS
}

export function getContractInfo(address: string): ContractInfo | undefined {
  return cachedMappings?.contracts.get(address.toLowerCase())
}

export function getMappingStats(): {
  sequencers: number
  receivers: number
  contracts: number
} {
  return {
    sequencers: cachedMappings?.sequencers.size ?? 0,
    receivers: Object.keys(cachedMappings?.receivers ?? STATIC_RECEIVER_MAPPING)
      .length,
    contracts: cachedMappings?.contracts.size ?? 0,
  }
}
