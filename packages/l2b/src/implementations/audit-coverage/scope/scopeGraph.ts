import type { ProjectAuditScope } from '@l2beat/config'
import type { FileOrigin, RepoSnapshot } from './RepoSnapshot'
import {
  type ParsedDeclaration,
  SolidityWorld,
  type UnitKind,
} from './SolidityWorld'

export type ScopeSnapshot =
  ProjectAuditScope['reports'][string]['snapshots'][number]
export type ScopeNode = ScopeSnapshot['nodes'][number]

export interface ScopedPath {
  path: string
  directory: boolean
}

/** What one report says about one repository at one commit. */
export interface SnapshotPlan {
  repository: string
  url: string
  commit: string
  /** Fully audited paths. */
  included: ScopedPath[]
  /** Paths reviewed as a diff or for selected functions only. */
  partial: ScopedPath[]
  /** Paths the report says were not reviewed. */
  excluded: string[]
  /** What the report says about code it does not list. */
  unlisted: 'not-mentioned' | 'excluded'
  /** A general statement about third-party code, if the report makes one. */
  dependencies?: 'included' | 'excluded'
}

/** A unit the report is silent about, with the source the relaxed reading uses. */
export interface ImpliedUnit {
  name: string
  origin: FileOrigin
  content: string
  timestamp: number
}

export interface BuiltSnapshot {
  snapshot: ScopeSnapshot
  implied: ImpliedUnit[]
  /** Notes for the run's log: unreadable submodules, files that do not parse. */
  warnings: string[]
}

const UNIT_KINDS = new Set(['contract', 'abstract', 'library', 'function'])
const TEST_SEGMENTS = new Set([
  'test',
  'tests',
  'mock',
  'mocks',
  'script',
  'scripts',
])

/**
 * The dependency graph of what a report names, see
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export function buildScopeGraph(
  plan: SnapshotPlan,
  repo: RepoSnapshot,
): BuiltSnapshot {
  const world = new SolidityWorld(repo)
  const sources = repo.ownFiles().filter((path) => path.endsWith('.sol'))
  const isExcluded = (path: string) =>
    plan.excluded.some((excluded) => isUnder(path, excluded))
  const expand = (scoped: ScopedPath[]) => {
    const files = new Set<string>()
    for (const { path, directory } of scoped) {
      if (!directory) {
        if (repo.has(path)) files.add(path)
        continue
      }
      for (const file of sources) {
        if (
          isUnder(file, path) &&
          !isTestOrMock(file, path) &&
          !isExcluded(file)
        ) {
          files.add(file)
        }
      }
    }
    return files
  }
  const included = expand(plan.included)
  const partial = expand(plan.partial)
  const ownPackages = new Set(
    [...included].map((path) => world.workspaceOf(path)?.dir ?? ''),
  )

  const externalOf = (path: string): ScopeNode['external'] => {
    const dependency = world.external(path)
    if (dependency !== undefined) return dependency
    const workspace = world.workspaceOf(path)
    if (
      workspace === undefined ||
      [...ownPackages].some((dir) => isUnder(dir, workspace.dir))
    ) {
      return undefined
    }
    return { package: workspace.name, version: workspace.version }
  }

  const nodes: ScopeNode[] = []
  const indexOf = new Map<string, number>()
  const edges = new Map<string, 'inherits' | 'uses'>()
  const interfaces = new Set<string>()
  const queue: number[] = []
  const declarationOf = new Map<number, ParsedDeclaration>()

  const stateOf = (
    path: string,
    external: ScopeNode['external'],
  ): Pick<ScopeNode, 'state' | 'partial' | 'generic'> => {
    if (included.has(path)) return { state: 'included' }
    if (partial.has(path)) return { state: 'included', partial: true }
    if (isExcluded(path)) return { state: 'excluded' }
    if (external !== undefined && plan.dependencies !== undefined) {
      return { state: plan.dependencies, generic: true }
    }
    return { state: plan.unlisted }
  }

  const addUnit = (path: string, declaration: ParsedDeclaration): number => {
    const key = `${path}#${declaration.name}`
    const known = indexOf.get(key)
    if (known !== undefined) return known
    const external = externalOf(path)
    const state = stateOf(path, external)
    const node: ScopeNode = {
      name: declaration.name,
      kind: declaration.kind as UnitKind,
      path,
      ...state,
      ...(external === undefined ? {} : { external }),
    }
    const index = nodes.push(node) - 1
    indexOf.set(key, index)
    declarationOf.set(index, declaration)
    // The closure continues from what was audited or is assumed to be.
    const expands =
      (node.state === 'included' && !node.partial) ||
      node.state === 'not-mentioned'
    if (expands) queue.push(index)
    return index
  }

  const addUnavailable = (name: string, raw: string): number => {
    const key = `?${raw}#${name}`
    const known = indexOf.get(key)
    if (known !== undefined) return known
    const index =
      nodes.push({
        name,
        kind: raw.includes('/libraries/') ? 'library' : 'contract',
        path: raw,
        state: 'unavailable',
        external: { package: packageOf(raw) },
      }) - 1
    indexOf.set(key, index)
    return index
  }

  /** The units a name leads to, through file-level types and directives. */
  const unitsBehind = (
    name: string,
    path: string,
    passed: Set<string>,
  ): number[] => {
    const lookup = world.lookup(name, path)
    if (lookup === undefined) return []
    if (!lookup.found) {
      const unit = name.split('.')[0] as string
      // An unreadable file cannot say what it declares; its name can.
      if (looksLikeInterface(unit, lookup.import)) {
        interfaces.add(`?${lookup.import}#${unit}`)
        return []
      }
      return [addUnavailable(unit, lookup.import)]
    }
    const { declaration } = lookup
    const key = `${lookup.path}#${declaration.name}`
    if (declaration.kind === 'interface') {
      interfaces.add(key)
      return []
    }
    if (UNIT_KINDS.has(declaration.kind)) {
      return [addUnit(lookup.path, declaration)]
    }
    if (passed.has(key)) return []
    passed.add(key)
    return declaration.references.flatMap((reference) =>
      unitsBehind(reference, lookup.path, passed),
    )
  }

  for (const path of [...included].sort()) {
    for (const declaration of world.declarations(path)) {
      if (declaration.kind === 'interface') {
        interfaces.add(`${path}#${declaration.name}`)
      } else if (UNIT_KINDS.has(declaration.kind)) {
        addUnit(path, declaration)
      }
    }
  }
  for (const path of [...partial].sort()) {
    for (const declaration of world.declarations(path)) {
      if (UNIT_KINDS.has(declaration.kind)) addUnit(path, declaration)
    }
  }
  // The queue grows while it is walked: each unit adds what it depends on.
  for (const from of queue) {
    const node = nodes[from] as ScopeNode
    const declaration = declarationOf.get(from) as ParsedDeclaration
    const passed = new Set<string>()
    for (const reference of declaration.references) {
      const kind = declaration.bases.includes(reference) ? 'inherits' : 'uses'
      for (const to of unitsBehind(reference, node.path, passed)) {
        if (to === from) continue
        const key = `${from},${to}`
        // A base contract that is also called is drawn as a base.
        if (kind === 'inherits' || !edges.has(key)) edges.set(key, kind)
      }
    }
  }

  const implied: ImpliedUnit[] = []
  for (const node of nodes) {
    if (node.state !== 'not-mentioned') continue
    const origin = repo.origin(node.path)
    const content = repo.read(node.path)
    const timestamp = origin && repo.timestamp(origin.mount)
    if (origin && content !== undefined && timestamp !== undefined) {
      implied.push({ name: node.name, origin, content, timestamp })
    }
  }

  return {
    snapshot: {
      repository: plan.repository,
      commit: plan.commit,
      nodes,
      edges: [...edges].map(([edge, kind]) => {
        const [from, to] = edge.split(',').map(Number)
        return [from as number, to as number, kind]
      }),
      interfaces: interfaces.size,
      explicitness: {
        own: share(nodes.filter((node) => node.external === undefined)),
        external: share(nodes.filter((node) => node.external !== undefined)),
      },
    },
    implied,
    warnings: [
      ...[...repo.unreadable].map(
        ([mount, reason]) => `submodule ${mount} is unreadable: ${reason}`,
      ),
      ...[...world.unparsed].map((path) => `${path} does not parse`),
    ],
  }
}

function share(nodes: ScopeNode[]): { named: number; total: number } {
  const named = nodes.filter(
    (node) => node.state === 'included' || node.state === 'excluded',
  )
  return { named: named.length, total: nodes.length }
}

function isUnder(path: string, directory: string): boolean {
  return (
    directory === '' || path === directory || path.startsWith(`${directory}/`)
  )
}

/** The dataset's rule for what a directory scope leaves out. */
function isTestOrMock(path: string, directory: string): boolean {
  const relative = directory === '' ? path : path.slice(directory.length + 1)
  const parts = relative.toLowerCase().split('/')
  return (
    parts.slice(0, -1).some((part) => TEST_SEGMENTS.has(part)) ||
    relative.toLowerCase().endsWith('.t.sol') ||
    relative.toLowerCase().endsWith('.s.sol')
  )
}

/** `@scope/name` or `name` of an import that is not a path. */
function packageOf(raw: string): string {
  const parts = raw.split('/')
  return raw.startsWith('@') ? parts.slice(0, 2).join('/') : (parts[0] ?? raw)
}

function looksLikeInterface(name: string, raw: string): boolean {
  return /^I[A-Z]/.test(name) || raw.includes('/interfaces/')
}
