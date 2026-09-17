import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { walk } from './fs.js'

// Reads deployed contracts straight from l2beat discovery output:
// `packages/config/src/projects/<project>/discovered.json` and `.flat/`.

export interface DeployedFile {
  /** Absolute path. */
  file: string
  /** Path relative to the config projects directory, used in the output. */
  relativePath: string
  role: 'implementation' | 'proxy'
}

export interface DeployedContract {
  name: string
  /** Chain specific address, e.g. `eth:0x...`. */
  chainSpecificAddress: string
  address: string
  chain: string
  template?: string
  sourceFiles: DeployedFile[]
}

export interface DeployedProject {
  projectId: string
  discoveryTimestamp: number
  contractSelection: 'critical' | 'all'
  contracts: DeployedContract[]
  /** Templates used by the selected contracts, e.g. `opstack/L1StandardBridge`. */
  templates: string[]
}

interface DiscoveredEntry {
  type: string
  name?: string
  address: string
  template?: string
  critical?: boolean
  unverified?: boolean
}

interface DiscoveredJson {
  name: string
  timestamp: number
  entries: DiscoveredEntry[]
}

export function hasDiscovery(projectsDir: string, projectId: string): boolean {
  return existsSync(path.join(projectsDir, projectId, 'discovered.json'))
}

/** Every project directory with a discovered.json. */
export function listDiscoveredProjects(projectsDir: string): string[] {
  return readdirSync(projectsDir)
    .filter(
      (name) =>
        !name.startsWith('_') &&
        !name.startsWith('.') &&
        hasDiscovery(projectsDir, name),
    )
    .sort()
}

export function readDeployedProject(
  projectsDir: string,
  projectId: string,
  options: { allContracts?: boolean } = {},
): DeployedProject {
  const projectDir = path.join(projectsDir, projectId)
  const discovered = readJsonc<DiscoveredJson>(
    path.join(projectDir, 'discovered.json'),
  )
  const flatDir = path.join(projectDir, '.flat')
  const entries = discovered.entries.filter((e) => e.type === 'Contract')
  const critical = entries.filter((e) => e.critical === true)
  const selected =
    options.allContracts || critical.length === 0 ? entries : critical
  const contractSelection =
    options.allContracts || critical.length === 0 ? 'all' : 'critical'

  const contracts = selected.map((entry): DeployedContract => {
    const [chain, address] = splitAddress(entry.address)
    const name = entry.name ?? address
    return {
      name,
      chainSpecificAddress: entry.address,
      address,
      chain,
      template: entry.template,
      sourceFiles: findFlatFiles(flatDir, name, entry.address).map((file) => ({
        file,
        relativePath: path
          .relative(projectsDir, file)
          .split(path.sep)
          .join('/'),
        role: file.endsWith('.p.sol') ? 'proxy' : 'implementation',
      })),
    }
  })

  return {
    projectId,
    discoveryTimestamp: discovered.timestamp,
    contractSelection,
    contracts,
    templates: [
      ...new Set(contracts.flatMap((c) => (c.template ? [c.template] : []))),
    ].sort(),
  }
}

/**
 * Finds the paths emitted by l2beat's flattenDiscoveredSources(): `<Name>.sol`
 * for a single source, `<Name>/` for proxy + implementation, and an address
 * suffix when several contracts share a name.
 */
export function findFlatFiles(
  flatDir: string,
  name: string,
  chainSpecificAddress: string,
): string[] {
  if (!existsSync(flatDir)) return []
  const bare = chainSpecificAddress.split(':').pop() ?? chainSpecificAddress
  const candidates = [
    name,
    `${name}-${chainSpecificAddress}`,
    `${name}-${bare}`,
  ]
  for (const candidate of candidates) {
    const file = path.join(flatDir, `${candidate}.sol`)
    if (existsSync(file) && statSync(file).isFile()) return [file]
    const dir = path.join(flatDir, candidate)
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return walk(dir).filter((f) => f.endsWith('.sol'))
    }
  }
  return []
}

function splitAddress(value: string): [string, string] {
  const index = value.indexOf(':')
  return index === -1
    ? ['', value]
    : [value.slice(0, index), value.slice(index + 1)]
}

/** discovered.json is plain JSON, but tolerate the jsonc used by config files. */
function readJsonc<T>(file: string): T {
  const text = readFileSync(file, 'utf8')
  try {
    return JSON.parse(text) as T
  } catch {
    const stripped = text
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/,(\s*[}\]])/g, '$1')
    return JSON.parse(stripped) as T
  }
}
