import { posix } from 'path'
import {
  ConfigReader,
  TemplateService,
  colorize,
  getDiscoveryPaths,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { command } from 'cmd-ts'

export const Colorize = command({
  name: 'colorize',
  args: {},
  handler: async () => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const chainConfigs = await Promise.all(
      configReader
        .readAllChains()
        .flatMap((chain) => configReader.readAllConfigsForChain(chain)),
    )
    for (const config of chainConfigs) {
      const discovery = configReader.readDiscovery(config.name, config.chain)
      const copy = structuredClone(discovery)
      const colorized = colorize(config, copy, templateService)
      const changed = JSON.stringify(discovery) !== JSON.stringify(colorized)
      if (changed) {
        const projectDiscoveryFolder = posix.join(
          paths.discovery,
          config.name,
          config.chain,
        )

        saveDiscoveredJson(colorized, projectDiscoveryFolder)
      }
    }
  },
})
