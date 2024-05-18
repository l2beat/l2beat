import { readdirSync } from 'fs'
import { readFileSync } from 'fs'
import path from 'path'
import { assert } from '@l2beat/backend-tools'
import { DiscoveryOutput } from '@l2beat/discovery-types'

import { stripAnsiEscapeCodes } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ZodError } from 'zod'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import { TemplateService } from '../analysis/TemplateService'
import { readJsonc } from '../utils/readJsonc'
import { DiscoveryConfig } from './DiscoveryConfig'
import { RawDiscoveryConfig } from './RawDiscoveryConfig'

export class ConfigReader {
  public templateService: TemplateService

  constructor(private readonly rootPath: string = '') {
    this.templateService = new TemplateService(rootPath)
  }

  readConfig(name: string, chain: string): DiscoveryConfig {
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, 'discovery', name)),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(
        path.join(this.rootPath, 'discovery', name, chain),
      ),
      'Chain not found in project, check if case matches',
    )

    const contents = readJsonc(
      path.join(this.rootPath, 'discovery', name, chain, 'config.jsonc'),
    )
    const rawConfig = RawDiscoveryConfig.safeParse(contents)
    if (!rawConfig.success) {
      const message = formatZodParsingError(rawConfig.error, 'config.jsonc')
      console.log(message)

      throw new Error(`Cannot parse file ${name}/${chain}/config.jsonc`)
    }

    this.templateService.inlineTemplates(rawConfig.data)
    const config = new DiscoveryConfig(rawConfig.data, this)

    assert(config.chain === chain, 'Chain mismatch in config.jsonc')

    return config
  }

  readDiscovery(name: string, chain: string): DiscoveryOutput {
    assert(
      fileExistsCaseSensitive(path.join(this.rootPath, 'discovery', name)),
      'Project not found, check if case matches',
    )
    assert(
      fileExistsCaseSensitive(
        path.join(this.rootPath, 'discovery', name, chain),
      ),
      'Chain not found in project, check if case matches',
    )

    const contents = readFileSync(
      path.join(this.rootPath, 'discovery', name, chain, 'discovered.json'),
      'utf-8',
    )

    const meta = JSON.parse(contents) as unknown as DiscoveryOutput
    assert(meta.chain === chain, 'Chain mismatch in discovered.json')
    return meta
  }

  readAllChains(): string[] {
    const folders = readdirSync(path.join(this.rootPath, 'discovery'), {
      withFileTypes: true,
    }).filter((x) => x.isDirectory() && !x.name.startsWith('_'))
    const chains = new Set<string>()
    for (const folder of folders) {
      readdirSync(path.join(this.rootPath, 'discovery', folder.name), {
        withFileTypes: true,
      })
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .forEach((x) => chains.add(x))
    }
    return [...chains]
  }

  readAllConfigsForChain(chain: string): DiscoveryConfig[] {
    const result: DiscoveryConfig[] = []
    const projects = this.readAllProjectsForChain(chain)

    for (const project of projects) {
      const contents = this.readConfig(project, chain)
      result.push(contents)
    }

    return result
  }

  readAllProjectsForChain(chain: string): string[] {
    const folders = readdirSync(path.join(this.rootPath, 'discovery'), {
      withFileTypes: true,
    }).filter((x) => x.isDirectory())

    const projects = []

    for (const folder of folders) {
      const contents = readdirSync(
        path.join(this.rootPath, 'discovery', folder.name),
        {
          withFileTypes: true,
        },
      )
        .filter((x) => x.isDirectory())
        .map((x) => x.name)

      if (!contents.includes(chain)) {
        continue
      }

      const chainFiles = readdirSync(
        path.join(this.rootPath, 'discovery', folder.name, chain),
        {
          withFileTypes: true,
        },
      )
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
