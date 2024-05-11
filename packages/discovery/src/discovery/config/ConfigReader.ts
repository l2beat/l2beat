import { readdirSync } from 'fs'
import path, { posix } from 'path'
import { assert } from '@l2beat/backend-tools'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { readFile } from 'fs/promises'
import { ParseError, parse } from 'jsonc-parser'

import { stripAnsiEscapeCodes } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ZodError } from 'zod'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import { TemplateService } from '../analysis/TemplateService'
import { DiscoveryConfig } from './DiscoveryConfig'
import { ContractMeta, DiscoveryMeta } from './DiscoveryMeta'
import { DiscoveryContract, RawDiscoveryConfig } from './RawDiscoveryConfig'

export const TEMPLATES_PATH = path.join('discovery', '_templates')

export class ConfigReader {
  public templateService: TemplateService

  constructor() {
    this.templateService = new TemplateService()
  }

  async readConfig(name: string, chain: string): Promise<DiscoveryConfig> {
    assert(
      fileExistsCaseSensitive(`discovery/${name}`),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(`discovery/${name}/${chain}`),
      'Chain not found in project, check if case matches',
    )

    const contents = await this.readJsonc(
      `discovery/${name}/${chain}/config.jsonc`,
    )
    const rawConfig = RawDiscoveryConfig.safeParse(contents)
    if (!rawConfig.success) {
      const message = formatZodParsingError(rawConfig.error, 'config.jsonc')
      console.log(message)

      throw new Error(`Cannot parse file ${name}/${chain}/config.jsonc`)
    }

    await this.inlineTemplates(rawConfig.data)
    const config = new DiscoveryConfig(rawConfig.data)

    assert(config.chain === chain, 'Chain mismatch in config.jsonc')

    return config
  }

  async readJsonc(path: string): Promise<JSON> {
    const contents = await readFile(path, 'utf-8')
    const errors: ParseError[] = []
    const parsed = parse(contents, errors, {
      allowTrailingComma: true,
    }) as JSON
    if (errors.length !== 0) {
      throw new Error(`Cannot parse file ${path}`)
    }
    return parsed
  }

  async inlineTemplates(rawConfig: RawDiscoveryConfig): Promise<void> {
    if (rawConfig.overrides === undefined) {
      return
    }
    for (const [name, contract] of Object.entries(rawConfig.overrides)) {
      if (contract.extends !== undefined) {
        const templateJson = await this.readJsonc(
          path.join(TEMPLATES_PATH, contract.extends, 'template.jsonc'),
        )
        const updatedContract = DiscoveryContract.parse({
          ...templateJson,
          ...contract,
        })
        rawConfig.overrides[name] = updatedContract
      }
    }
  }

  async readMeta(
    name: string,
    chain: string,
    skipTemplates: boolean = false,
  ): Promise<DiscoveryMeta | undefined> {
    const projectPath = posix.join('discovery', name)
    const chainPath = posix.join(projectPath, chain)
    const metaPath = posix.join(chainPath, 'meta.json')

    assert(
      fileExistsCaseSensitive(projectPath),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(chainPath),
      'Chain not found in project, check if case matches',
    )

    if (!fileExistsCaseSensitive(metaPath)) {
      return undefined
    }

    const contents = await readFile(metaPath, 'utf-8')

    const meta = DiscoveryMeta.parse(JSON.parse(contents))
    if (!skipTemplates) {
      this.inlineMetaTemplates(meta)
      meta._templatesWereInlined = true
    }
    return meta
  }

  inlineMetaTemplates(rawMeta: DiscoveryMeta): void {
    const expandedContracts: ContractMeta[] = []
    for (const contract of rawMeta.contracts) {
      if (contract.extends !== undefined) {
        const template = this.templateService.readContractMetaTemplate(
          contract.extends,
        )
        const expandedContract = ContractMeta.parse({
          ...template,
          ...contract,
        })
        // merge each value separately to not overwrite the whole object
        expandedContract.values = template.values ?? {}
        for (const [key, value] of Object.entries(contract.values ?? {})) {
          expandedContract.values[key] = {
            ...expandedContract.values[key],
            ...value,
          }
        }
        expandedContracts.push(expandedContract)
      } else {
        expandedContracts.push(contract)
      }
    }
    rawMeta.contracts = expandedContracts
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

    const meta = JSON.parse(contents) as unknown as DiscoveryOutput
    assert(meta.chain === chain, 'Chain mismatch in discovered.json')
    return meta
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
