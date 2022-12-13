import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'

import { DiscoveryConfig } from './DiscoveryConfig'

export class ConfigReader {
  async readConfig(name: string) {
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
}
