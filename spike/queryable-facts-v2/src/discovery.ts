// A discovery project (packages/config/src/projects/<name>): discovered.json plus the flattened sources
// discovery wrote next to it (.flat/). This module reads both and writes discovery down as facts, the
// same way src/emit.ts writes the AST down: mechanically, with an encoding that depends on the *shape*
// of the JSON, never on what a field means. What a value means ("`owner` is who may call `setAddress`")
// is the business of rules/project.dl.
//
//   dEntry(Addr, Type, Name, ProxyType, Template)        one row per discovered address (Contract or EOA)
//   dImpl(Addr, CodeAddr, ContractName, Role)            the code at Addr: itself (self), a proxy, or an implementation
//   dUnit(Addr, CodeAddr, Unit)                          the flattened source file that code was compiled from
//   dValue(Addr, Field, Path, Kind, Value)               every value discovery recorded, flattened: Path is "" for a
//                                                        scalar, "[i]" inside arrays, ".key" inside objects
//
// Discovery's own permission model (the `permissions` block) is deliberately not read: it is itself the
// output of another rule engine, and these rules should derive who may do what from the code alone.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, join, posix } from 'path'
import { Facts } from './emit'

export const DISCOVERY_RELATIONS: Record<string, number> = {
  dEntry: 5,
  dImpl: 4,
  dUnit: 3,
  dValue: 5,
}

export interface DiscoveredEntry {
  address: string
  type: 'Contract' | 'EOA' | 'Reference' | string
  name?: string
  proxyType?: string
  template?: string
  description?: string
  implementationNames?: Record<string, string>
  values?: Record<string, unknown>
  sourceHashes?: string[]
}

export interface DiscoveredJson {
  name: string
  timestamp?: number
  entries: DiscoveredEntry[]
  usedTemplates?: Record<string, string>
}

export type CodeRole = 'self' | 'proxy' | 'implementation'

/** One flattened source file of the project: the code at one address, belonging to one discovered entry. */
export interface ProjectUnit {
  /** Relative path under .flat, also the source-unit name solc sees and the `<unit>:` prefix of every id. */
  unit: string
  /** File-system-safe name for the unit's run folder. */
  slug: string
  path: string
  /** The discovered entry this code belongs to (the proxy address for proxied contracts). */
  address: string
  entryName: string
  /** Where this code lives on chain (equals `address` for self/proxy roles). */
  codeAddress: string
  contractName: string
  role: CodeRole
  bytes: number
}

export interface MissingUnit {
  address: string
  entryName: string
  codeAddress: string
  contractName: string
  role: CodeRole
  expectedPath: string
}

export interface Project {
  name: string
  dir: string
  discoveredPath: string
  flatDir: string
  discovered: DiscoveredJson
  units: ProjectUnit[]
  /** Code discovery knows about but wrote no flattened file for. */
  missing: MissingUnit[]
}

export interface ProjectChoice {
  id: string
  name: string
  dir: string
  contracts: number
  eoas: number
  units: number
  timestamp?: number
}

/** Projects under packages/config/src/projects that have both a discovered.json and flattened sources. */
export function listProjects(projectsDir: string): ProjectChoice[] {
  if (!existsSync(projectsDir)) return []
  const out: ProjectChoice[] = []
  for (const entry of readdirSync(projectsDir, { withFileTypes: true }).sort(
    (a, b) => a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue
    const dir = join(projectsDir, entry.name)
    const discoveredPath = join(dir, 'discovered.json')
    const flatDir = join(dir, '.flat')
    if (!existsSync(discoveredPath) || !existsSync(flatDir)) continue
    try {
      const discovered = JSON.parse(
        readFileSync(discoveredPath, 'utf8'),
      ) as DiscoveredJson
      const contracts = discovered.entries.filter(
        (e) => e.type === 'Contract',
      ).length
      const eoas = discovered.entries.filter((e) => e.type === 'EOA').length
      out.push({
        id: entry.name,
        name: discovered.name ?? entry.name,
        dir,
        contracts,
        eoas,
        units: listSolFiles(flatDir).length,
        timestamp: discovered.timestamp,
      })
    } catch {
      // unreadable discovered.json: not offered
    }
  }
  return out
}

function listSolFiles(dir: string, prefix = ''): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory())
      out.push(
        ...listSolFiles(join(dir, entry.name), `${prefix}${entry.name}/`),
      )
    else if (entry.name.endsWith('.sol')) out.push(`${prefix}${entry.name}`)
  }
  return out.sort()
}

export function unitSlug(unit: string): string {
  return unit.replace(/\.sol$/, '').replace(/[^\w.-]+/g, '_')
}

/**
 * Reads a project folder. The mapping from discovered entries to flattened files mirrors
 * packages/discovery's flattenDiscoveredSources: `<name>.sol` for a single source bundle,
 * `<name>/<Contract>.p.sol` (proxy) + `<name>/<Contract>.sol` (implementation) for proxied contracts,
 * `<name>-<address>` when two entries share a name, `.<i>` suffixes when there are several implementations.
 */
export function loadProject(dir: string): Project {
  const discoveredPath = join(dir, 'discovered.json')
  const flatDir = join(dir, '.flat')
  const discovered = JSON.parse(
    readFileSync(discoveredPath, 'utf8'),
  ) as DiscoveredJson
  const contracts = discovered.entries.filter((e) => e.type === 'Contract')
  const nameCounts = new Map<string, number>()
  for (const c of contracts) {
    const n = c.name ?? ''
    nameCounts.set(n, (nameCounts.get(n) ?? 0) + 1)
  }
  const files = new Set(listSolFiles(flatDir))
  const units: ProjectUnit[] = []
  const missing: MissingUnit[] = []
  for (const c of contracts) {
    const entryName = c.name ?? c.address
    const outName =
      (nameCounts.get(c.name ?? '') ?? 0) > 1
        ? `${entryName}-${c.address}`
        : entryName
    const bundles = Object.entries(c.implementationNames ?? {})
    if (bundles.length === 0) {
      bundles.push([c.address, entryName])
    }
    const many = bundles.length > 1
    bundles.forEach(([codeAddress, contractName], index) => {
      const isProxy = many && codeAddress === c.address
      const role: CodeRole = !many
        ? 'self'
        : isProxy
          ? 'proxy'
          : 'implementation'
      const postfix = isProxy ? '.p' : bundles.length > 2 ? `.${index}` : ''
      const expected = many
        ? posix.join(outName, `${contractName}${postfix}.sol`)
        : `${outName}.sol`
      let unit: string | undefined = files.has(expected) ? expected : undefined
      if (!unit && many) {
        // fall back to any file in the folder with the right role
        const candidates = [...files].filter(
          (f) =>
            f.startsWith(`${outName}/`) &&
            f.endsWith('.p.sol') === isProxy &&
            basename(f).startsWith(contractName),
        )
        if (candidates.length === 1) unit = candidates[0]
      }
      if (!unit) {
        missing.push({
          address: c.address,
          entryName,
          codeAddress,
          contractName,
          role,
          expectedPath: expected,
        })
        return
      }
      const path = join(flatDir, unit)
      units.push({
        unit,
        slug: unitSlug(unit),
        path,
        address: c.address,
        entryName,
        codeAddress,
        contractName,
        role,
        bytes: statSync(path).size,
      })
    })
  }
  return {
    name: discovered.name ?? basename(dir),
    dir,
    discoveredPath,
    flatDir,
    discovered,
    units,
    missing,
  }
}

const ADDRESS_RE = /^(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}$/

/** How a JSON leaf is written down: address | number | boolean | string | null. */
export function valueKind(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number' || typeof value === 'bigint') return 'number'
  if (typeof value === 'string') {
    if (ADDRESS_RE.test(value)) return 'address'
    if (/^-?\d+$/.test(value)) return 'number'
    return 'string'
  }
  return 'string'
}

/** Discovery's output as facts. See the header for the encoding. */
export function discoveryFacts(project: Project): Facts {
  const facts = new Facts(DISCOVERY_RELATIONS)
  const { discovered } = project
  for (const e of discovered.entries) {
    facts.add(
      'dEntry',
      e.address,
      e.type,
      e.name ?? '',
      e.proxyType ?? '',
      e.template ?? '',
    )
    if (e.type !== 'Contract') continue
    const bundles = Object.entries(e.implementationNames ?? {})
    if (bundles.length === 0) bundles.push([e.address, e.name ?? ''])
    const many = bundles.length > 1
    for (const [codeAddress, contractName] of bundles) {
      const role: CodeRole = !many
        ? 'self'
        : codeAddress === e.address
          ? 'proxy'
          : 'implementation'
      facts.add('dImpl', e.address, codeAddress, contractName, role)
    }
    for (const [field, value] of Object.entries(e.values ?? {})) {
      flattenValue(value, '', (path, leaf) =>
        facts.add(
          'dValue',
          e.address,
          field,
          path,
          valueKind(leaf),
          leaf === null || leaf === undefined ? '' : String(leaf),
        ),
      )
    }
  }
  for (const u of project.units)
    facts.add('dUnit', u.address, u.codeAddress, u.unit)
  return facts
}

function flattenValue(
  value: unknown,
  path: string,
  leaf: (path: string, value: unknown) => void,
): void {
  if (Array.isArray(value)) {
    if (value.length === 0) leaf(path, '[]')
    value.forEach((item, i) => flattenValue(item, `${path}[${i}]`, leaf))
  } else if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
    if (entries.length === 0) leaf(path, '{}')
    for (const [k, v] of entries) flattenValue(v, `${path}.${k}`, leaf)
  } else {
    leaf(path, value)
  }
}
