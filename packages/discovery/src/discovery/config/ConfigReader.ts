import { ChainId, DiscoveryOutput } from '@l2beat/shared-pure'
import { readdirSync } from 'fs'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'

import { DiscoveryConfig } from './DiscoveryConfig'
import { RawDiscoveryConfig } from './RawDiscoveryConfig'

export class ConfigReader {
  async readConfig(name: string, chain: ChainId): Promise<DiscoveryConfig> {
    const chainName = ChainId.getName(chain).toString()
    const contents = await readFile(
      `discovery/${name}/${chainName}/config.jsonc`,
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
    return new DiscoveryConfig(rawConfig)
  }

  async readAllConfigsForChain(chain: ChainId): Promise<DiscoveryConfig[]> {
    const result: DiscoveryConfig[] = []

    const configs = readdirSync('discovery', { withFileTypes: true })
      .filter((x) => x.isDirectory())
      .map((x) => x.name)

    for (const config of configs) {
      const contents = await this.readConfig(config, chain)
      result.push(contents)
    }

    return result
  }

  async readDiscovery(name: string, chain: ChainId): Promise<DiscoveryOutput> {
    const chainName = ChainId.getName(chain).toString()

    const contents = await readFile(
      `discovery/${name}/${chainName}/discovered.json`,
      'utf-8',
    )

    const parsed: unknown = JSON.parse(contents)

    return parsed as DiscoveryOutput
  }
}
