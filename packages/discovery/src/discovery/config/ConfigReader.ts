import {
  assert,
  ChainSpecificAddress,
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

  constructor(private rootPath: string) {}

  readConfig(name: string, chain: string): ConfigRegistry {
    const rawConfig = this.readRawConfig(name)

    // TODO(radomski): Remove and heavily simplify when doing L2B-10789
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

    if (
      'initialAddresses' in rawConfigForChain &&
      Array.isArray(rawConfigForChain.initialAddresses)
    ) {
      const addresses: unknown[] = rawConfigForChain.initialAddresses
      rawConfigForChain.initialAddresses = addresses.map((x) =>
        ChainSpecificAddress.fromLong(chain, x as unknown as string),
      )
    }

    if (
      'overrides' in rawConfigForChain &&
      !Array.isArray(rawConfigForChain.overrides) &&
      typeof rawConfigForChain.overrides === 'object'
    ) {
      const overrides = rawConfigForChain.overrides as Record<string, unknown>
      const newOverrides: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(overrides)) {
        const newKey = ChainSpecificAddress.fromLong(chain, key).toString()
        newOverrides[newKey] = value
      }
      rawConfigForChain.overrides = newOverrides
    }

    if (
      'names' in rawConfigForChain &&
      !Array.isArray(rawConfigForChain.names) &&
      typeof rawConfigForChain.names === 'object'
    ) {
      const names = rawConfigForChain.names as Record<string, unknown>
      const newNames: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(names)) {
        const newKey = ChainSpecificAddress.fromLong(chain, key).toString()
        newNames[newKey] = value
      }
      rawConfigForChain.names = newNames
    }

    const config = new ConfigRegistry(rawConfigForChain)

    assert(config.structure.chain === chain, 'Chain mismatch in config.jsonc')

    return config
  }

  readRawConfig(name: string) {
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, name)),
      'Project not found, check if case matches',
    )

    const basePath = path.join(this.rootPath, name)
    assert(
      fileExistsCaseSensitive(path.join(basePath)),
      'Chain not found in project, check if case matches',
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
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, name)),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, name, chain)),
      'Chain not found in project, check if case matches',
    )

    const contents = readFileSync(
      path.join(this.rootPath, name, chain, 'discovered.json'),
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
    return readdirSync(path.join(this.rootPath), { withFileTypes: true })
      .filter((x) => x.isDirectory() && !x.name.startsWith('_'))
      .map((projectDir) => {
        const projectPath = path.join(this.rootPath, projectDir.name)

        try {
          const parsed = readJsonc(path.join(projectPath, 'config.jsonc'))
          assert(
            'chains' in parsed &&
              typeof parsed.chains === 'object' &&
              parsed.chains !== null,
          )

          return {
            project: projectDir.name,
            chains: Object.keys(parsed.chains),
          }
        } catch {
          return { project: projectDir.name, chains: [] }
        }
      })
      .filter((x) => x.chains.length > 0)
  }

  // NOTE(radomski): Generates a list of projects that _have_ a
  // discovered.json. Most of the time this is what you want to use. We assume
  // that projects that have a discovered.json are also configured.
  readAllDiscoveredProjects(): { project: string; chains: string[] }[] {
    return readdirSync(path.join(this.rootPath), { withFileTypes: true })
      .filter((x) => x.isDirectory() && !x.name.startsWith('_'))
      .map((projectDir) => {
        const projectPath = path.join(this.rootPath, projectDir.name)
        const chains = readdirSync(projectPath, { withFileTypes: true })
          .filter((x) => x.isDirectory())
          .map((x) => x.name)
          .filter((chain) =>
            existsSync(path.join(projectPath, chain, 'discovered.json')),
          )
        return { project: projectDir.name, chains }
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
    if (!existsSync(path.join(this.rootPath, name, 'config.jsonc'))) {
      return []
    }

    const parsed = readJsonc(path.join(this.rootPath, name, 'config.jsonc'))
    assert(
      'chains' in parsed &&
        typeof parsed.chains === 'object' &&
        parsed.chains !== null,
    )
    const chains = Object.keys(parsed.chains)
    const result = chains.filter((chain) =>
      existsSync(path.join(this.rootPath, name, chain, 'discovered.json')),
    )

    return result
  }

  readDiffHistoryHash(name: string, chain: string): Hash160 | undefined {
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, name)),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, name, chain)),
      'Chain not found in project, check if case matches',
    )

    const content = readFileSync(
      path.join(this.rootPath, name, chain, 'diffHistory.md'),
      'utf-8',
    )
    const hashLine = content.split('\n')[0]
    if (hashLine !== undefined && hashLine.startsWith(HASH_LINE_PREFIX)) {
      const hashString = hashLine.slice(HASH_LINE_PREFIX.length)
      return Hash160(hashString)
    }
  }

  getProjectPath(project: string): string {
    return path.join(this.rootPath, project)
  }

  getProjectChainPath(project: string, chain: string): string {
    return path.join(this.getProjectPath(project), chain)
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
