import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

interface SequencerInfo {
  project: string
  name?: string
  role?: string
}

export type SequencerMapping = Map<string, SequencerInfo>

interface DiscoveryEntry {
  address: string
  name?: string
  receivedPermissions?: Array<{
    permission: string
    from: string
    role?: string
  }>
}

interface DiscoveryOutput {
  name: string
  entries: DiscoveryEntry[]
}

// Permission types that indicate blob-posting/sequencing roles
const SEQUENCER_PERMISSIONS = [
  'sequence',
  'operateStarknet',
  'operateStarkEx',
  'operateLinea',
  'validate',
  'validateZkStack',
  'propose', // some rollups use proposers to post data
]

// Value fields that contain sequencer/batcher addresses
const SEQUENCER_VALUE_FIELDS = [
  'batcherHash',
  'BATCHER',
  'batcher',
  'sequencer',
  'Sequencer',
  'operator',
  'Operator',
]

// Array value fields that contain multiple sequencer addresses
const SEQUENCER_ARRAY_FIELDS = [
  'batchPosters',
  'sequencers',
  'operators',
  'batchers',
  'validators',
]

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
  // Handle eth: prefixed addresses
  if (address.startsWith('eth:')) {
    return address.replace('eth:', '').toLowerCase()
  }
  // Handle raw addresses
  if (address.startsWith('0x') && address.length === 42) {
    return address.toLowerCase()
  }
  return null
}

export function getSequencerMapping(projectsPath: string): SequencerMapping {
  const mapping: SequencerMapping = new Map()
  const files = findDiscoveredJsonFiles(projectsPath)

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8')
      const data: DiscoveryOutput = JSON.parse(content)
      const projectName = data.name

      for (const entry of data.entries) {
        // Only consider eth: addresses (Ethereum mainnet)
        if (!entry.address?.startsWith('eth:')) continue

        // Check for sequencer-related permissions
        const sequencerPerms = entry.receivedPermissions?.filter((p) =>
          SEQUENCER_PERMISSIONS.includes(p.permission),
        )

        if (sequencerPerms && sequencerPerms.length > 0) {
          const address = normalizeAddress(entry.address)
          if (address && !mapping.has(address)) {
            mapping.set(address, {
              project: projectName,
              name: entry.name,
              role: sequencerPerms[0].role || sequencerPerms[0].permission,
            })
          }
        }
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return mapping
}

export function getSequencerMappingExtended(
  projectsPath: string,
): SequencerMapping {
  const mapping = getSequencerMapping(projectsPath)
  const files = findDiscoveredJsonFiles(projectsPath)

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8')
      const data: DiscoveryOutput = JSON.parse(content)
      const projectName = data.name

      for (const entry of data.entries) {
        const values = (entry as any).values
        if (!values) continue

        // Check for single-value sequencer fields
        for (const field of SEQUENCER_VALUE_FIELDS) {
          const value = values[field]
          if (typeof value === 'string') {
            const address = normalizeAddress(value)
            if (address && !mapping.has(address)) {
              mapping.set(address, {
                project: projectName,
                name: `${field} (from ${entry.name || entry.address})`,
                role: `.${field}`,
              })
            }
          }
        }

        // Check for array sequencer fields
        for (const field of SEQUENCER_ARRAY_FIELDS) {
          const arr = values[field]
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (typeof item === 'string') {
                const address = normalizeAddress(item)
                if (address && !mapping.has(address)) {
                  mapping.set(address, {
                    project: projectName,
                    name: `${field} (from ${entry.name || entry.address})`,
                    role: `.${field}`,
                  })
                }
              }
            }
          }
        }
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return mapping
}
