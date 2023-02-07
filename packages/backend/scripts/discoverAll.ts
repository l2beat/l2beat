import { execSync } from 'child_process'

import { ConfigReader } from '../src/core/discovery/ConfigReader'

export async function discoverAll() {
  const configReader = new ConfigReader()

  const configs = await configReader.readAllConfigs()

  for (const config of configs) {
    console.log('Running discovery for:', config.name)

    execSync(`yarn discover ${config.name}`)

    console.log('Discovery finished for:', config.name, '\n')
  }
}

discoverAll().catch((error) => {
  console.error(error)
  process.exit(1)
})
