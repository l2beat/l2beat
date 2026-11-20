import { parse } from '@mradomski/fast-solidity-parser'
import * as posix from 'path/posix'
import { join, type RepoSnapshot } from './RepoSnapshot'

export type UnitKind = 'contract' | 'abstract' | 'library' | 'function'

export interface ParsedDeclaration {
  name: string
  /** `other` is a file-level struct, enum, type, constant, error, event or using directive. */
  kind: UnitKind | 'interface' | 'other'
  /** Names the declaration's code mentions, `A` or `A.B`. */
  references: string[]
  /** The references that are base contracts. */
  bases: string[]
}

interface ParsedImport {
  raw: string
  /** Undefined when the import does not resolve to a file of the snapshot. */
  target: string | undefined
  /** `[original, alias]` pairs; null imports everything. */
  symbols: [string, string | null][] | null
  unitAlias: string | null
}

interface ParsedSource {
  declarations: Map<string, ParsedDeclaration>
  imports: ParsedImport[]
}

export type Lookup =
  | { found: true; path: string; declaration: ParsedDeclaration }
  /** The name is imported from a file that is not in the snapshot. */
  | { found: false; import: string }

interface Project {
  root: string
  remappings: { context: string; prefix: string; target: string }[]
  libraries: string[]
}

const PROJECT_CONFIGS = ['foundry.toml', 'remappings.txt', 'package.json']
const DEPENDENCY_SEGMENTS = new Set(['node_modules', '.deps'])
const VENDORED_SEGMENTS = new Set([
  'vendor',
  'vendored',
  'thirdparty',
  'third_party',
  'dependencies',
])

/**
 * The Solidity of a snapshot: files parsed on demand, imports resolved the
 * way the audited project's toolchain would, and names looked up through
 * them. See section 2.1 of
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export class SolidityWorld {
  private readonly sources = new Map<string, ParsedSource | undefined>()
  private readonly projects = new Map<string, Project[]>()
  private workspace: Map<string, { dir: string; version?: string }> | undefined
  /** Files that do not parse as Solidity. */
  readonly unparsed = new Set<string>()

  constructor(readonly snapshot: RepoSnapshot) {}

  declarations(path: string): ParsedDeclaration[] {
    return [...(this.source(path)?.declarations.values() ?? [])]
  }

  /** The declaration a name used in `path` refers to, through its imports. */
  lookup(name: string, path: string): Lookup | undefined {
    const [head, ...rest] = name.split('.')
    if (head === undefined) return undefined
    const source = this.source(path)
    if (source === undefined) return undefined
    const member = rest[0]
    if (member !== undefined) {
      const namespace = source.imports.find((i) => i.unitAlias === head)
      if (namespace !== undefined) {
        return namespace.target === undefined
          ? { found: false, import: namespace.raw }
          : this.find(member, namespace.target, new Set())
      }
    }
    return this.find(head, path, new Set())
  }

  /** The dependency a file belongs to, undefined for the project's own code. */
  external(path: string): { package: string; version?: string } | undefined {
    const mount = this.snapshot.mountOf(path)
    if (mount !== '') {
      const origin = this.snapshot.origin(path)
      const tag = this.snapshot.tagAt(mount)
      return {
        package: origin?.repository ?? mount,
        version: tag ?? origin?.commit.slice(0, 8),
      }
    }
    const parts = path.split('/').slice(0, -1)
    const segment = parts.findIndex(
      (part) => DEPENDENCY_SEGMENTS.has(part) || VENDORED_SEGMENTS.has(part),
    )
    if (segment !== -1) {
      return { package: parts.slice(0, segment + 2).join('/') }
    }
    for (const project of this.projectsOf(path)) {
      for (const library of project.libraries) {
        const directory = join(project.root, library)
        if (path.startsWith(`${directory}/`)) {
          const name = path.slice(directory.length + 1).split('/')[0]
          return { package: `${directory}/${name}` }
        }
      }
    }
    return undefined
  }

  /** The monorepo package a path was reached through, when imported by name. */
  workspacePackage(
    raw: string,
  ): { name: string; dir: string; version?: string } | undefined {
    const packages = this.workspacePackages()
    let best: string | undefined
    for (const name of packages.keys()) {
      if (
        (raw === name || raw.startsWith(`${name}/`)) &&
        (best === undefined || name.length > best.length)
      ) {
        best = name
      }
    }
    if (best === undefined) return undefined
    return { name: best, ...(packages.get(best) as { dir: string }) }
  }

  /** The monorepo package a file of the audited repository belongs to. */
  workspaceOf(
    path: string,
  ): { name: string; dir: string; version?: string } | undefined {
    if (this.snapshot.mountOf(path) !== '') return undefined
    let best: { name: string; dir: string; version?: string } | undefined
    for (const [name, pkg] of this.workspacePackages()) {
      const contains = pkg.dir === '' || path.startsWith(`${pkg.dir}/`)
      if (
        contains &&
        (best === undefined || pkg.dir.length > best.dir.length)
      ) {
        best = { name, ...pkg }
      }
    }
    return best
  }

  private find(
    name: string,
    path: string,
    seen: Set<string>,
  ): Lookup | undefined {
    if (seen.has(path)) return undefined
    seen.add(path)
    const source = this.source(path)
    if (source === undefined) return undefined
    const own = source.declarations.get(name)
    if (own !== undefined) return { found: true, path, declaration: own }
    let unresolved: Lookup | undefined
    for (const directive of source.imports) {
      if (directive.symbols !== null) {
        const symbol = directive.symbols.find(
          ([original, alias]) => (alias ?? original) === name,
        )
        if (symbol === undefined) continue
        if (directive.target === undefined) {
          return { found: false, import: directive.raw }
        }
        // A fresh set: the named file may import back what was seen on the way.
        const found = this.find(symbol[0], directive.target, new Set())
        if (found !== undefined) return found
        continue
      }
      if (directive.unitAlias !== null) continue
      if (directive.target === undefined) {
        // Nothing says what an unreadable file declares; by convention it is
        // the unit its file is named after.
        if (posix.basename(directive.raw, '.sol') === name) {
          unresolved ??= { found: false, import: directive.raw }
        }
        continue
      }
      const found = this.find(name, directive.target, seen)
      if (found?.found) return found
      unresolved ??= found
    }
    return unresolved
  }

  private source(path: string): ParsedSource | undefined {
    if (this.sources.has(path)) return this.sources.get(path)
    const content = this.snapshot.read(path)
    let source: ParsedSource | undefined
    if (content !== undefined) {
      try {
        source = this.parseSource(path, content)
      } catch {
        this.unparsed.add(path)
      }
    }
    this.sources.set(path, source)
    return source
  }

  private parseSource(path: string, content: string): ParsedSource {
    const declarations = new Map<string, ParsedDeclaration>()
    const imports: ParsedImport[] = []
    const usings: { name: string; global: string | undefined }[] = []
    for (const node of parse(content, { range: false }).children) {
      // biome-ignore lint/suspicious/noExplicitAny: the walk is generic over node shapes
      const n = node as any
      switch (n.type) {
        case 'ImportDirective':
          imports.push({
            raw: n.path,
            target: this.resolveImport(n.path, path),
            symbols: n.symbolAliases,
            unitAlias: n.unitAlias,
          })
          break
        case 'ContractDefinition':
          add(declarations, n.name, n.kind, n)
          break
        case 'FunctionDefinition':
          if (n.name !== null) add(declarations, n.name, 'function', n)
          break
        case 'UsingForDeclaration': {
          const name = `$using${usings.length}`
          add(declarations, name, 'other', n)
          const target = firstName(n.typeName)
          usings.push({ name, global: n.isGlobal ? target : undefined })
          break
        }
        case 'StructDefinition':
        case 'EnumDefinition':
        case 'TypeDefinition':
        case 'FileLevelConstant':
        case 'EventDefinition':
        case 'CustomErrorDefinition':
          if (typeof n.name === 'string') add(declarations, n.name, 'other', n)
          break
      }
    }
    // A global directive binds functions to its type wherever the type is
    // used; any other one applies to everything declared in its file.
    for (const using of usings) {
      for (const declaration of declarations.values()) {
        if (declaration.name === using.name) continue
        if (using.global === undefined || using.global === declaration.name) {
          declaration.references.push(using.name)
        }
      }
    }
    return { declarations, imports }
  }

  private resolveImport(raw: string, from: string): string | undefined {
    for (const candidate of this.candidates(raw, from)) {
      const normalized = posix.normalize(candidate)
      if (!normalized.startsWith('..') && this.snapshot.has(normalized)) {
        return normalized
      }
    }
    return undefined
  }

  private *candidates(raw: string, from: string): Generator<string> {
    if (raw.startsWith('./') || raw.startsWith('../')) {
      yield posix.join(posix.dirname(from), raw)
      return
    }
    const projects = this.projectsOf(from)
    for (const project of projects) {
      const relative =
        project.root === '' ? from : from.slice(project.root.length + 1)
      const matching = project.remappings
        .filter(
          (r) => raw.startsWith(r.prefix) && relative.startsWith(r.context),
        )
        .sort(
          (a, b) =>
            b.context.length - a.context.length ||
            b.prefix.length - a.prefix.length,
        )
      for (const remapping of matching) {
        yield join(
          project.root,
          posix.join(remapping.target, raw.slice(remapping.prefix.length)),
        )
      }
      yield join(project.root, raw)
      const [name, ...rest] = raw.split('/')
      for (const library of project.libraries) {
        for (const sources of ['src', 'contracts', '']) {
          yield join(
            project.root,
            posix.join(library, name as string, sources, ...rest),
          )
        }
        yield join(project.root, posix.join(library, raw))
      }
    }
    if (this.snapshot.mountOf(from) === '') {
      const workspace = this.workspacePackage(raw)
      if (workspace !== undefined) {
        yield join(workspace.dir, raw.slice(workspace.name.length + 1))
      }
    }
  }

  /** Projects whose settings apply to the file, nearest first. */
  private projectsOf(path: string): Project[] {
    const directory = posix.dirname(path) === '.' ? '' : posix.dirname(path)
    const known = this.projects.get(directory)
    if (known !== undefined) return known
    const result: Project[] = []
    const parts = directory === '' ? [] : directory.split('/')
    for (let end = parts.length; end >= 0; end--) {
      const root = parts.slice(0, end).join('/')
      const isMountRoot = this.snapshot.mountOf(join(root, 'x')) === root
      const hasConfig = PROJECT_CONFIGS.some((name) =>
        this.snapshot.has(join(root, name)),
      )
      if (hasConfig || isMountRoot) result.push(this.loadProject(root))
    }
    this.projects.set(directory, result)
    return result
  }

  private loadProject(root: string): Project {
    const remappings: Project['remappings'] = []
    const libraries = new Set<string>()
    const toml = this.snapshot.read(join(root, 'foundry.toml'))
    if (toml !== undefined) {
      for (const list of arraysOf(toml, 'remappings')) {
        remappings.push(...list.flatMap(parseRemapping))
      }
      for (const list of arraysOf(toml, 'libs')) {
        for (const library of list) libraries.add(library.replace(/\/$/, ''))
      }
    }
    const text = this.snapshot.read(join(root, 'remappings.txt'))
    if (text !== undefined) {
      remappings.push(...text.split('\n').flatMap(parseRemapping))
    }
    if (libraries.size === 0) libraries.add('lib')
    libraries.delete('node_modules')
    return { root, remappings, libraries: [...libraries] }
  }

  private workspacePackages(): Map<string, { dir: string; version?: string }> {
    if (this.workspace !== undefined) return this.workspace
    this.workspace = new Map()
    for (const path of this.snapshot.configsNamed('package.json', '')) {
      if (path.split('/').some((part) => DEPENDENCY_SEGMENTS.has(part))) {
        continue
      }
      try {
        const json = JSON.parse(this.snapshot.read(path) ?? '{}')
        if (typeof json.name === 'string') {
          const dir = posix.dirname(path) === '.' ? '' : posix.dirname(path)
          this.workspace.set(json.name, { dir, version: json.version })
        }
      } catch {
        // Not a package.
      }
    }
    return this.workspace
  }
}

function add(
  declarations: Map<string, ParsedDeclaration>,
  name: string,
  kind: string,
  node: unknown,
) {
  if (declarations.has(name)) return
  const references = new Set<string>()
  collectNames(node, references, new Set())
  references.delete(name)
  // biome-ignore lint/suspicious/noExplicitAny: the walk is generic over node shapes
  const bases = ((node as any).baseContracts ?? []).map(
    // biome-ignore lint/suspicious/noExplicitAny: the walk is generic over node shapes
    (base: any) => base.baseName.namePath as string,
  )
  declarations.set(name, {
    name,
    kind: kind as ParsedDeclaration['kind'],
    references: [...references],
    bases,
  })
}

/** Every name the code under `node` mentions: identifiers, types, bases, libraries. */
function collectNames(node: unknown, names: Set<string>, seen: Set<object>) {
  if (node === null || typeof node !== 'object' || seen.has(node)) return
  seen.add(node)
  if (Array.isArray(node)) {
    for (const item of node) collectNames(item, names, seen)
    return
  }
  // biome-ignore lint/suspicious/noExplicitAny: the walk is generic over node shapes
  const n = node as any
  switch (n.type) {
    case 'Identifier':
      names.add(n.name)
      break
    case 'UserDefinedTypeName':
      names.add(n.namePath)
      break
    case 'ModifierInvocation':
      names.add(n.name)
      break
    case 'UsingForDeclaration':
      if (n.libraryName) names.add(n.libraryName)
      for (const name of n.functions ?? []) names.add(name)
      break
    case 'MemberAccess':
      if (n.expression?.type === 'Identifier') {
        names.add(`${n.expression.name}.${n.memberName}`)
      }
      break
  }
  for (const [key, value] of Object.entries(n)) {
    if (key === 'range' || key === 'loc') continue
    collectNames(value, names, seen)
  }
}

function firstName(typeName: unknown): string | undefined {
  // biome-ignore lint/suspicious/noExplicitAny: the walk is generic over node shapes
  const n = typeName as any
  return n?.type === 'UserDefinedTypeName'
    ? (n.namePath as string).split('.')[0]
    : undefined
}

/** The string arrays assigned to `key` anywhere in a TOML file. */
function arraysOf(toml: string, key: string): string[][] {
  const result: string[][] = []
  const pattern = new RegExp(`^\\s*${key}\\s*=\\s*\\[([^\\]]*)\\]`, 'gm')
  for (const match of toml.matchAll(pattern)) {
    result.push(
      [...(match[1] as string).matchAll(/["']([^"']+)["']/g)].map(
        (m) => m[1] as string,
      ),
    )
  }
  return result
}

function parseRemapping(line: string): Project['remappings'] {
  const trimmed = line.trim()
  const equals = trimmed.indexOf('=')
  if (trimmed.length === 0 || trimmed.startsWith('#') || equals === -1) {
    return []
  }
  const left = trimmed.slice(0, equals)
  const colon = left.indexOf(':')
  return [
    {
      context: colon === -1 ? '' : left.slice(0, colon),
      prefix: colon === -1 ? left : left.slice(colon + 1),
      target: trimmed.slice(equals + 1),
    },
  ]
}
