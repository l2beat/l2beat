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

        const sequencePerms = entry.receivedPermissions?.filter(
          (p) => p.permission === 'sequence',
        )

        if (sequencePerms && sequencePerms.length > 0) {
          const address = entry.address.replace('eth:', '').toLowerCase()
          mapping.set(address, {
            project: projectName,
            name: entry.name,
            role: sequencePerms[0].role,
          })
        }
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return mapping
}

// Also extract batcher addresses from contract values (batcherHash, sequencer, etc.)
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

        // Check for common batcher/sequencer value fields
        const batcherFields = [
          'batcherHash',
          'BATCHER',
          'batcher',
          'sequencer',
          'Sequencer',
        ]

        for (const field of batcherFields) {
          const value = values[field]
          if (typeof value === 'string' && value.startsWith('eth:')) {
            const address = value.replace('eth:', '').toLowerCase()
            if (!mapping.has(address)) {
              mapping.set(address, {
                project: projectName,
                name: `${field} (from ${entry.name || entry.address})`,
                role: `.${field}`,
              })
            }
          }
        }

        // Check batchPosters array (Arbitrum)
        const batchPosters = values.batchPosters
        if (Array.isArray(batchPosters)) {
          for (const poster of batchPosters) {
            if (typeof poster === 'string' && poster.startsWith('eth:')) {
              const address = poster.replace('eth:', '').toLowerCase()
              if (!mapping.has(address)) {
                mapping.set(address, {
                  project: projectName,
                  name: `BatchPoster (from ${entry.name || entry.address})`,
                  role: '.batchPosters',
                })
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
