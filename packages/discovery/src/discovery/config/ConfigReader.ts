import { assert } from '@l2beat/backend-tools'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { readdirSync } from 'fs'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'

import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import { DiscoveryConfig } from './DiscoveryConfig'
import { RawDiscoveryConfig } from './RawDiscoveryConfig'

export class ConfigReader {
  async readConfig(name: string, chain: string): Promise<DiscoveryConfig> {
    assert(
      fileExistsCaseSensitive(`discovery/${name}`),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(`discovery/${name}/${chain}`),
      'Chain not found in project, check if case matches',
    )

    const contents = await readFile(
      `discovery/${name}/${chain}/config.jsonc`,
      'utf-8',
    )
    const errors: ParseError[] = []
    const parsed: unknown = parse(contents, errors, {
      allowTrailingComma: true,
    })
    if (errors.length !== 0) {
      throw new Error('Cannot parse file')
    }
    const rawConfig = RawDiscoveryConfig.parse(parsed)
    const config = new DiscoveryConfig(rawConfig)

    assert(config.chain === chain, 'Chain mismatch in config.jsonc')

    return config
  }

  async readDiscovery(name: string, chain: string): Promise<DiscoveryOutput> {
    assert(
      fileExistsCaseSensitive(`discovery/${name}`),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(`discovery/${name}/${chain}`),
      'Chain not found in project, check if case matches',
    )

    const contents = await readFile(
      `discovery/${name}/${chain}/discovered.json`,
      'utf-8',
    )

    const discovery = JSON.parse(contents) as unknown as DiscoveryOutput
    assert(discovery.chain === chain, 'Chain mismatch in discovered.json')
    return discovery
  }

  readAllChains(): string[] {
    const folders = readdirSync('discovery', { withFileTypes: true }).filter(
      (x) => x.isDirectory() && !x.name.startsWith('_'),
    )
    const chains = new Set<string>()
    for (const folder of folders) {
      readdirSync(`discovery/${folder.name}`, { withFileTypes: true })
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .forEach((x) => chains.add(x))
    }
    return [...chains]
  }

  async readAllConfigsForChain(chain: string): Promise<DiscoveryConfig[]> {
    const result: DiscoveryConfig[] = []
    const projects = this.readAllProjectsForChain(chain)

    for (const project of projects) {
      const contents = await this.readConfig(project, chain)
      result.push(contents)
    }

    return result
  }

  readAllProjectsForChain(chain: string): string[] {
    const folders = readdirSync('discovery', { withFileTypes: true }).filter(
      (x) => x.isDirectory(),
    )

    const projects = []

    for (const folder of folders) {
      const contents = readdirSync(`discovery/${folder.name}`, {
        withFileTypes: true,
      })
        .filter((x) => x.isDirectory())
        .map((x) => x.name)

      if (!contents.includes(chain)) {
        continue
      }

      const chainFiles = readdirSync(`discovery/${folder.name}/${chain}`, {
        withFileTypes: true,
      })
        .filter((x) => x.isFile())
        .map((x) => x.name)

      const hasConfig = chainFiles.includes('config.jsonc')
      const hasDiscovered = chainFiles.includes('discovered.json')
      if (!hasConfig || !hasDiscovered) {
        continue
      }

      projects.push(folder.name)
    }

    return projects
  }
}
