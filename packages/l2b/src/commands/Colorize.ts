import path from 'path'
import {
  ConfigReader,
  TemplateService,
  colorize,
  combineStructureAndColor,
  getDiscoveryPaths,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { command } from 'cmd-ts'
import { updateDiffHistoryHash } from '../implementations/discovery/hashing'

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
      const color = colorize(config.color, discovery, templateService)

      const colorized = combineStructureAndColor(discovery, color)
      const changed = JSON.stringify(discovery) !== JSON.stringify(colorized)
      if (changed) {
        const projectDiscoveryFolder = configReader.getProjectChainPath(
          config.name,
          config.chain,
        )

        await saveDiscoveredJson(colorized, projectDiscoveryFolder)

        updateDiffHistoryHash(
          configReader,
          path.join(projectDiscoveryFolder, 'diffHistory.md'),
          config.name,
          config.chain,
        )
      }
    }
  },
})
