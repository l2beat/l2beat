import { ProjectParameters } from '@l2beat/shared'
import { readdirSync } from 'fs'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'

import { DiscoveryConfig } from './DiscoveryConfig'

export class ConfigReader {
  async readConfig(name: string): Promise<DiscoveryConfig> {
    const contents = await readFile(`discovery/${name}/config.jsonc`, 'utf-8')
    const errors: ParseError[] = []
    const parsed: unknown = parse(contents, errors, {
      allowTrailingComma: true,
    })
    if (errors.length !== 0) {
      throw new Error('Cannot parse file')
    }
    return DiscoveryConfig.parse(parsed)
  }

  async readAllConfigs(): Promise<DiscoveryConfig[]> {
    const result: DiscoveryConfig[] = []

    const configs = readdirSync('discovery').filter(
      (x) => x !== 'config.schema.json' && x !== 'README.md',
    )

    for (const config of configs) {
      const contents = await this.readConfig(config)

      result.push(DiscoveryConfig.parse(contents))
    }

    return result
  }

  async readDiscovery(name: string): Promise<ProjectParameters> {
    const contents = await readFile(
      `discovery/${name}/discovered.json`,
      'utf-8',
    )

    const parsed: unknown = JSON.parse(contents)

    return parsed as ProjectParameters
  }
}
