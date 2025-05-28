import { createHash } from 'crypto'
import { existsSync, readFileSync, readdirSync } from 'fs'
import path from 'path'
import {
  assert,
  Hash160,
  type json,
  stripAnsiEscapeCodes,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import merge from 'lodash/merge'
import { type ZodError, z } from 'zod'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { DiscoveryOutput } from '../output/types'
import { readJsonc } from '../utils/readJsonc'
import { ConfigRegistry } from './ConfigRegistry'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

type JustImport = z.infer<typeof JustImport>
const JustImport = z
  .object({ import: z.optional(z.array(z.string())) })
  .passthrough()

export class ConfigReader {
  private importedCache = new Map<string, JustImport>()

  constructor(private rootPath: string) {}

  readConfig(name: string, chain: string): ConfigRegistry {
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
    const parseResult = JustImport.safeParse(contents)
    if (!parseResult.success) {
      const message = formatZodParsingError(parseResult.error, 'config.jsonc')
      console.log(message)

      throw new Error(`Cannot parse file ${name}/${chain}/config.jsonc`)
    }

    let rawConfig = parseResult.data
    if (rawConfig.import !== undefined) {
      const visited = new Set<string>()
      rawConfig = merge(
        this.resolveImports(basePath, rawConfig.import, visited),
        rawConfig,
      )
    }

    const chainRawConfig = {
      chain,
      name,
      ...merge(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (rawConfig.chains as any)['all'],
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (rawConfig.chains as any)[chain],
      ),
    }

    const config = new ConfigRegistry(chainRawConfig)

    assert(config.structure.chain === chain, 'Chain mismatch in config.jsonc')

    return config
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

  readAllProjectChainPairs(): { project: string; chains: string[] }[] {
    return readdirSync(path.join(this.rootPath), { withFileTypes: true })
      .filter((x) => x.isDirectory() && !x.name.startsWith('_'))
      .map((projectDir) => {
        const projectPath = path.join(this.rootPath, projectDir.name)
        const chains = readdirSync(projectPath, { withFileTypes: true })
          .filter((x) => x.isDirectory())
          .map((x) => x.name)
        return { project: projectDir.name, chains }
      })
  }

  readAllChains(): string[] {
    const chains = new Set(
      this.readAllProjectChainPairs().flatMap((x) => x.chains),
    )
    return [...chains]
  }

  readAllConfigs(): ConfigRegistry[] {
    return this.readAllChains().flatMap((chain) =>
      this.readAllConfigsForChain(chain),
    )
  }

  readAllConfigsForChain(chain: string): ConfigRegistry[] {
    const result: ConfigRegistry[] = []
    const projects = this.readAllProjectsForChain(chain)

    for (const project of projects) {
      const contents = this.readConfig(project, chain)
      result.push(contents)
    }

    return result
  }

  readAllChainsForProject(name: string) {
    if (!existsSync(path.join(this.rootPath, name, 'config.jsonc'))) {
      return []
    }
    const config = readFileSync(
      path.join(this.rootPath, name, 'config.jsonc'),
      'utf-8',
    )

    const parsed = JSON.parse(config)
    return Object.keys(parsed.chains)
  }

  readAllProjectsForChain(chain: string): string[] {
    const folders = readdirSync(path.join(this.rootPath), {
      withFileTypes: true,
    }).filter((x) => x.isDirectory())

    const projects = []

    for (const folder of folders) {
      const contents = readdirSync(path.join(this.rootPath, folder.name), {
        withFileTypes: true,
      })
        .filter((x) => x.isDirectory())
        .map((x) => x.name)

      if (!contents.includes(chain)) {
        continue
      }

      const chainFiles = readdirSync(
        path.join(this.rootPath, folder.name, chain),
        {
          withFileTypes: true,
        },
      )
        .filter((x) => x.isFile())
        .map((x) => x.name)

      const allChains = this.readAllChainsForProject(folder.name)

      const hasConfig = allChains.includes(chain)
      const hasDiscovered = chainFiles.includes('discovered.json')
      if (!hasConfig && !hasDiscovered) {
        continue
      }

      projects.push(folder.name)
    }

    return projects
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
        const parseResult = JustImport.safeParse(contents)
        if (!parseResult.success) {
          const message = formatZodParsingError(parseResult.error, importPath)
          console.log(message)

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

function formatZodParsingError(error: ZodError, fileName: string): string {
  const errors = error.errors
  const lines = [
    `${chalk.red(' ERROR:')} reading ${fileName} encountered ${
      errors.length
    } issues:`,
    ...errors.flatMap((x) => {
      return [` ${chalk.yellow(x.message)}`, ` >    ${x.path.join('.')}`]
    }),
  ]

  const maxLength = Math.max(
    ...lines.map((x) => stripAnsiEscapeCodes(x).length),
  )
  return [
    chalk.red(`╔${'═'.repeat(maxLength - 1)}╗`),
    ...lines,
    chalk.red(`╚${'═'.repeat(maxLength - 1)}╝`),
  ].join('\n')
}
