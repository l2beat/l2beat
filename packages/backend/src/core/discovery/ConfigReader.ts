import { readFile } from 'fs/promises'

import { DiscoveryConfig } from './DiscoveryConfig'

export class ConfigReader {
  async readConfig(name: string) {
    const contents = await readFile(`discovery/${name}/config.json`, 'utf-8')
    return DiscoveryConfig.parse(JSON.parse(contents))
  }
}
