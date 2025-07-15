import {
  assert,
  formatAsciiBorder,
  Hash160,
  type json,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { createHash } from 'crypto'
import { existsSync, readdirSync, readFileSync } from 'fs'
import merge from 'lodash/merge'
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

  /**
   * Some directories are used only for grouping purposes (e.g. `(tokens)` in
   * `projects/(tokens)/usdc`). These should be completely transparent for the
   * discovery tooling.  We treat every directory whose name **starts with** `(`
   * and **ends with** `)` as such a *grouping folder* – mirroring the behaviour
   * of [Next.js routing](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#grouping).  All public methods that previously
   * assumed `rootPath/<project>` now rely on {@link resolveProjectPath} to find
   * the actual directory of a project regardless of the grouping folders.
   */
  private isGroupingFolder(dirName: string): boolean {
    return dirName.startsWith('(') && dirName.endsWith(')')
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
  private resolveProjectPath(project: string): string {
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
    const queue: string[] = [this.rootPath]
    const matches: string[] = []

    while (queue.length > 0) {
      const current = queue.shift()
      if (current === undefined) {
        continue
      }
      const entries = readdirSync(current, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        if (entry.name.startsWith('_')) continue // keep existing behaviour

        const full = path.join(current, entry.name)

        if (
          entry.name === project &&
          fileExistsCaseSensitive(full) &&
          existsSync(path.join(full, 'config.jsonc'))
        ) {
          matches.push(full)
        } else if (this.isGroupingFolder(entry.name)) {
          queue.push(full)
        }
      }
    }
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
  private enumerateProjectDirectories(): string[] {
    const result: string[] = []
    const stack: string[] = [this.rootPath]

    while (stack.length > 0) {
      const current = stack.pop()
      if (current === undefined) continue

      const entries = readdirSync(current, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        if (entry.name.startsWith('_')) continue

        const full = path.join(current, entry.name)

        if (this.isGroupingFolder(entry.name)) {
          stack.push(full)
        } else {
          result.push(full)
        }
      }
    }

    return result
  }

  constructor(private rootPath: string) {}

  readConfig(name: string, chain: string): ConfigRegistry {
    const rawConfig = this.readRawConfig(name)

    const rawConfigForChain = {
      chain,
      name,
      ...(rawConfig.archived ? { archived: true } : {}),
      modelCrossChainPermissions: rawConfig.modelCrossChainPermissions,
      ...merge(
        // biome-ignore lint/suspicious/noExplicitAny: it's there
        (rawConfig.chains as any)['all'],
        // biome-ignore lint/suspicious/noExplicitAny: it's there
        (rawConfig.chains as any)[chain],
      ),
    }

    const config = new ConfigRegistry(rawConfigForChain)

    assert(config.structure.chain === chain, 'Chain mismatch in config.jsonc')

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

  readDiscovery(name: string, chain: string): DiscoveryOutput {
    const projectPath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )
    const chainPath = path.join(projectPath, chain)
    assert(
      fileExistsCaseSensitive(chainPath),
      'Chain not found in project, check if case matches',
    )

    const contents = readFileSync(
      path.join(chainPath, 'discovered.json'),
      'utf-8',
    )

    const meta = JSON.parse(contents) as unknown as DiscoveryOutput
    assert(meta.chain === chain, 'Chain mismatch in discovered.json')
    return meta
  }

  readDiscoveryHash(projectName: string, chain: string): Hash160 {
    const curDiscovery = this.readDiscovery(projectName, chain)
    const hasher = createHash('sha1')
    hasher.update(JSON.stringify(curDiscovery))
    return Hash160(`0x${hasher.digest('hex')}`)
  }

  // NOTE(radomski): This returns all projects and chains on which they are
  // configured that have a config.jsonc file. They might not yet have a
  // discovered.json file. Most of the time you want to use
  // readAllDiscoveredProjects()
  readAllConfiguredProjects(): { project: string; chains: string[] }[] {
    return this.enumerateProjectDirectories()
      .map((projectPath) => {
        const projectName = path.basename(projectPath)
        try {
          const parsed = readJsonc(path.join(projectPath, 'config.jsonc'))
          assert(
            'chains' in parsed &&
              typeof parsed.chains === 'object' &&
              parsed.chains !== null,
          )
          return {
            project: projectName,
            chains: Object.keys(parsed.chains),
          }
        } catch {
          return { project: projectName, chains: [] }
        }
      })
      .filter((x) => x.chains.length > 0)
  }

  // NOTE(radomski): Generates a list of projects that _have_ a
  // discovered.json. Most of the time this is what you want to use. We assume
  // that projects that have a discovered.json are also configured.
  readAllDiscoveredProjects(): { project: string; chains: string[] }[] {
    return this.enumerateProjectDirectories()
      .map((projectPath) => {
        const projectName = path.basename(projectPath)
        const chains = readdirSync(projectPath, { withFileTypes: true })
          .filter((x) => x.isDirectory())
          .map((x) => x.name)
          .filter((chain) =>
            existsSync(path.join(projectPath, chain, 'discovered.json')),
          )
        return { project: projectName, chains }
      })
      .filter((x) => x.chains.length > 0)
  }

  readAllDiscoveredConfigsForChain(chain: string): ConfigRegistry[] {
    const result: ConfigRegistry[] = []
    const projects = this.readAllDiscoveredProjects()
      .filter((p) => p.chains.includes(chain))
      .map((x) => x.project)

    for (const project of projects) {
      const contents = this.readConfig(project, chain)
      result.push(contents)
    }

    return result
  }

  readAllDiscoveredChainsForProject(name: string) {
    let projectPath: string
    try {
      projectPath = this.resolveProjectPath(name)
    } catch {
      return []
    }

    if (!existsSync(path.join(projectPath, 'config.jsonc'))) {
      return []
    }

    const parsed = readJsonc(path.join(projectPath, 'config.jsonc'))
    assert(
      'chains' in parsed &&
        typeof parsed.chains === 'object' &&
        parsed.chains !== null,
    )
    const chains = Object.keys(parsed.chains)
    const result = chains.filter((chain) =>
      existsSync(path.join(projectPath, chain, 'discovered.json')),
    )

    return result
  }

  readDiffHistoryHash(name: string, chain: string): Hash160 | undefined {
    const projectPath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )
    const chainPath = path.join(projectPath, chain)
    assert(
      fileExistsCaseSensitive(chainPath),
      'Chain not found in project, check if case matches',
    )

    const content = readFileSync(
      path.join(chainPath, 'diffHistory.md'),
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

  getProjectChainPath(project: string, chain: string): string {
    return path.join(this.getProjectPath(project), chain)
  }

  getProjectsInGroup(group: string): string[] {
    return this.enumerateProjectDirectories().filter((projectPath) => {
      const parentDir = path.basename(path.dirname(projectPath))
      return parentDir === `(${group})`
    })
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
}
