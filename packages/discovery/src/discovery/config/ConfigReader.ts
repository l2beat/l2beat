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

  readAllConfiguredProjects(): string[] {
    return this.enumerateProjectDirectories()
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
      .map((projectPath) => path.basename(projectPath))
  }

  // NOTE(radomski): Generates a list of projects that _have_ a
  // discovered.json. Most of the time this is what you want to use. We assume
  // that projects that have a discovered.json are also configured.
  readAllDiscoveredProjects(): string[] {
    return this.enumerateProjectDirectories()
      .filter((projectPath) =>
        existsSync(path.join(projectPath, 'discovered.json')),
      )
      .map((projectPath) => path.basename(projectPath))
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

  readDiffLastDescription(name: string): string | undefined {
    const projectPath = this.resolveProjectPath(name)
    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )

    const content = readFileSync(
      path.join(projectPath, 'diffHistory.md'),
      'utf-8',
    )
    const lines = content.split('\n')
    const index = lines.findIndex((l) => l === '## Description')
    if (index < 0) {
      return undefined
    }

    const followingLines = lines.slice(index + 1)
    const lastIndex = followingLines.findIndex((l) => l.startsWith('## '))
    if (lastIndex < 0) {
      return followingLines.join('\n').trim()
    }

    return followingLines.slice(0, lastIndex).join('\n').trim()
  }

  getProjectPath(project: string): string {
    return this.resolveProjectPath(project)
  }

  clearImportedCache(): void {
    this.importedCache.clear()
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

  resolveProjectPath(project: string): string {
    const full = path.join(this.rootPath, project)
    if (
      !fileExistsCaseSensitive(full) ||
      !existsSync(path.join(full, 'config.jsonc'))
    ) {
      throw new Error('Project not found, check if case matches')
    }
    return full
  }

  enumerateProjectDirectories(): string[] {
    return readdirSync(this.rootPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
      .map((entry) => path.join(this.rootPath, entry.name))
  }
}

function getReferencedProjects(discovery: DiscoveryOutput): string[] {
  return uniq(
    discovery.entries
      .map((e) => e.targetProject)
      .filter(notUndefined)
      .sort(),
  )
}
