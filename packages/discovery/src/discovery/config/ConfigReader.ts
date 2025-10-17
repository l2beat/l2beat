import {
  assert,
  formatAsciiBorder,
  Hash160,
  type json,
  notUndefined,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { createHash } from 'crypto'
import { existsSync, readdirSync, readFileSync } from 'fs'
import merge from 'lodash/merge'
import uniq from 'lodash/uniq'
import path from 'path'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { DiscoveryOutput } from '../output/types'
import { readJsonc } from '../utils/readJsonc'
import { ConfigRegistry } from './ConfigRegistry'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

type JustImport = v.infer<typeof JustImport>
const JustImport = v.object({ import: v.array(v.string()).optional() })

export class ConfigReader {
  private importedCache = new Map<string, JustImport>()

  /**
   * Cache for already resolved project directories. The key is the project name, the
   * value is the absolute directory that contains the project files (its basename
   * equals the project name).
   */
  private readonly projectPathCache = new Map<string, string>()

  constructor(private rootPath: string) {}

  readConfig(name: string): ConfigRegistry {
    const rawConfig = this.readRawConfig(name)

    const rawConfigForChain = {
      ...rawConfig,
      ...(rawConfig.archived ? { archived: true } : {}),
    }

    const config = new ConfigRegistry(rawConfigForChain)

    return config
  }

  readRawConfig(name: string) {
    const basePath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(basePath),
      'Project not found, check if case matches',
    )

    const contents = readJsonc(path.join(basePath, 'config.jsonc'))
    const parseResult = JustImport.safeValidate(contents)
    if (!parseResult.success) {
      console.log(formatAsciiBorder([parseResult.message, 'config.jsonc']))

      throw new Error(`Cannot parse file ${name}/config.jsonc`)
    }

    // biome-ignore lint/suspicious/noExplicitAny: hack that we are aware of
    let rawConfig = parseResult.data as any
    if (rawConfig.import !== undefined) {
      const visited = new Set<string>()
      rawConfig = merge(
        this.resolveImports(basePath, rawConfig.import, visited),
        rawConfig,
      )
    }
    return rawConfig
  }

  readRawConfigAsText(name: string): string {
    const basePath = this.resolveProjectPath(name)
    return readFileSync(path.join(basePath, 'config.jsonc'), 'utf-8')
  }

  readDiscovery(name: string): DiscoveryOutput {
    const projectPath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )

    const contents = readFileSync(
      path.join(projectPath, 'discovered.json'),
      'utf-8',
    )

    return JSON.parse(contents) as unknown as DiscoveryOutput
  }

  readDiscoveryWithReferences(projectName: string): DiscoveryOutput[] {
    const seen = new Set<string>()
    return this._readDiscoveryWithReferences(projectName, seen)
  }

  private _readDiscoveryWithReferences(
    projectName: string,
    seen: Set<string>,
  ): DiscoveryOutput[] {
    if (seen.has(projectName)) {
      return []
    }

    seen.add(projectName)

    const discovery = this.readDiscovery(projectName)
    const references = [
      ...getReferencedProjects(discovery),
      ...(discovery.sharedModules ?? []),
    ]

    return [
      discovery,
      ...references
        .map((reference) => this._readDiscoveryWithReferences(reference, seen))
        .flat(),
    ]
  }

  readDiscoveryHash(projectName: string): Hash160 {
    const curDiscovery = this.readDiscovery(projectName)
    const hasher = createHash('sha1')
    hasher.update(JSON.stringify(curDiscovery))
    return Hash160(`0x${hasher.digest('hex')}`)
  }

  readAllConfiguredProjects(options: { skipGroup?: string } = {}): string[] {
    return this.enumerateProjectDirectories()
      .filter(
        (path) =>
          !options.skipGroup || !path.includes(`(${options.skipGroup})`),
      ) // quick fix to hide tokens in DiscoUI
      .filter((projectPath) => {
        const configPath = path.join(projectPath, 'config.jsonc')

        if (!existsSync(configPath)) {
          return false
        }

        const config = readJsonc(configPath)

        if (
          'initialAddresses' in config &&
          Array.isArray(config.initialAddresses) &&
          config.initialAddresses.every((x) => typeof x === 'string')
        ) {
          return true
        }

        return false
      })
      .map((projectPath) => {
        return path.basename(projectPath)
      })
  }

  // NOTE(radomski): Generates a list of projects that _have_ a
  // discovered.json. Most of the time this is what you want to use. We assume
  // that projects that have a discovered.json are also configured.
  readAllDiscoveredProjects(options: { skipGroup?: string } = {}): string[] {
    return this.enumerateProjectDirectories()
      .filter(
        (path) =>
          !options.skipGroup || !path.includes(`(${options.skipGroup})`),
      ) // quick fix to hide tokens in DiscoUI
      .filter((projectPath) => {
        const discoveredPath = path.join(projectPath, 'discovered.json')

        if (!existsSync(discoveredPath)) {
          return false
        }

        return true
      })
      .map((projectPath) => {
        return path.basename(projectPath)
      })
  }

  readDiffHistoryHash(name: string): Hash160 | undefined {
    const projectPath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )

    const content = readFileSync(
      path.join(projectPath, 'diffHistory.md'),
      'utf-8',
    )
    const hashLine = content.split('\n')[0]
    if (hashLine !== undefined && hashLine.startsWith(HASH_LINE_PREFIX)) {
      const hashString = hashLine.slice(HASH_LINE_PREFIX.length)
      return Hash160(hashString)
    }
  }

  getProjectPath(project: string): string {
    return this.resolveProjectPath(project)
  }

  resolveImports(
    basePath: string,
    imports: string[],
    visited: Set<string>,
  ): json {
    let result: json = {}
    for (const importPath of imports) {
      const resolvedPath = path.resolve(basePath, importPath)
      if (visited.has(resolvedPath)) {
        throw new Error(`Circular import detected: ${importPath}`)
      }
      visited.add(resolvedPath)

      let rawConfig = this.importedCache.get(resolvedPath)
      if (rawConfig === undefined) {
        const contents = readJsonc(resolvedPath)
        const parseResult = JustImport.safeValidate(contents)
        if (!parseResult.success) {
          console.log(formatAsciiBorder([parseResult.message, importPath]))

          throw new Error(`Cannot parse file ${importPath}`)
        }
        rawConfig = parseResult.data
        this.importedCache.set(resolvedPath, rawConfig)
      }

      if (rawConfig.import !== undefined) {
        const importBasePath = path.dirname(resolvedPath)
        result = merge(
          this.resolveImports(importBasePath, rawConfig.import, visited),
          result,
        )
      }
      result = merge(result, rawConfig)
    }
    return result
  }

  // #region Grouping
  getProjectsInGroup(group: string): string[] {
    return this.enumerateProjectDirectories().flatMap((projectPath) => {
      const basename = path.basename(projectPath)
      const parentDir = path.basename(path.dirname(projectPath))
      if (parentDir === `(${group})`) {
        return [basename]
      }
      return []
    })
  }

  /**
   * Some directories are used only for grouping purposes (e.g. `(tokens)` in
   * `projects/(tokens)/usdc`). These should be completely transparent for the
   * discovery tooling.  We treat every directory whose name **starts with** `(`
   * and **ends with** `)` as such a *grouping folder* – mirroring the behaviour
   * of Next.js routing. All public methods that previously
   * assumed `rootPath/<project>` now rely on {@link resolveProjectPath} to find
   * the actual directory of a project regardless of the grouping folders.
   */
  isGroupingFolder(dirName: string): boolean {
    return dirName.startsWith('(') && dirName.endsWith(')')
  }

  /**
   * Recursively traverses the directory structure, handling grouping folders.
   * This is the common logic used by both resolveProjectPath and enumerateProjectDirectories.
   *
   * @param visitor Function called for each directory entry. Return true to continue traversal, false to stop.
   * @param searchStrategy 'breadth' for BFS (used by resolveProjectPath) or 'depth' for DFS (used by enumerateProjectDirectories)
   */
  private traverseDirectories<T>(
    visitor: (entryName: string, fullPath: string) => T | null,
    searchStrategy: 'breadth' | 'depth',
  ): T[] {
    const result: T[] = []
    const queue: string[] = [this.rootPath]

    while (queue.length > 0) {
      const current = searchStrategy === 'breadth' ? queue.shift() : queue.pop()
      if (current === undefined) continue

      const entries = readdirSync(current, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        if (entry.name.startsWith('_')) continue // keep existing behaviour

        const full = path.join(current, entry.name)
        const visitResult = visitor(entry.name, full)

        if (visitResult !== null) {
          result.push(visitResult)
        } else if (this.isGroupingFolder(entry.name)) {
          queue.push(full)
        }
      }
    }

    return result
  }

  projectConfigExists(project: string): boolean {
    try {
      this.resolveProjectPath(project)
      return true
    } catch {
      return false
    }
  }

  getConfigPath(project: string): string {
    return path.join(this.resolveProjectPath(project), 'config.jsonc')
  }

  /**
   * Locate the on-disk directory for a given project. The search rules are:
   * 1. Direct child of `rootPath` (legacy layout).
   * 2. Recursively within any *grouping folder* (a directory wrapped in
   *    parentheses). Only grouping folders are traversed – other regular
   *    directories are treated as leaf project directories to keep the search
   *    space small.
   *
   * Throws if the project cannot be found or if there are multiple matches.
   */
  resolveProjectPath(project: string): string {
    const cached = this.projectPathCache.get(project)
    if (cached !== undefined) {
      return cached
    }

    // 1. Fast path – direct child of root (must contain config.jsonc)
    const direct = path.join(this.rootPath, project)
    if (
      fileExistsCaseSensitive(direct) &&
      existsSync(path.join(direct, 'config.jsonc'))
    ) {
      this.projectPathCache.set(project, direct)
      return direct
    }

    // 2. Breadth-first search within grouping folders
    const matches = this.traverseDirectories<string>((entryName, full) => {
      if (
        entryName === project &&
        fileExistsCaseSensitive(full) &&
        existsSync(path.join(full, 'config.jsonc'))
      ) {
        return full
      }
      return null
    }, 'breadth')

    if (matches.length === 0) {
      throw new Error('Project not found, check if case matches')
    }
    if (matches.length > 1) {
      const locations = matches.map((m) => path.relative(this.rootPath, m))
      throw new Error(
        `Multiple projects named "${project}" found in grouping folders: ${locations.join(', ')}`,
      )
    }

    // matches[0] is defined because we checked matches.length above
    const match = matches[0] as string
    this.projectPathCache.set(project, match)
    return match
  }

  /**
   * Recursively gathers absolute paths of all *project* directories – these are
   * directories that are **not** grouping folders (their name does **not** start
   * with `(`) and are direct children of either `rootPath` or any grouping
   * folder below it.
   */
  enumerateProjectDirectories(): string[] {
    return this.traverseDirectories<string>((entryName, full) => {
      if (!this.isGroupingFolder(entryName)) {
        return full
      }
      return null
    }, 'depth')
  }

  // #endregion
}

function getReferencedProjects(discovery: DiscoveryOutput): string[] {
  return uniq(
    discovery.entries
      .map((e) => e.targetProject)
      .filter(notUndefined)
      .sort(),
  )
}
