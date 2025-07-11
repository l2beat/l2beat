import {
  ConfigReader,
  colorize,
  combineStructureAndColor,
  getDiscoveryPaths,
  saveDiscoveredJson,
  TemplateService,
} from '@l2beat/discovery'
import { command, option, optional, string } from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

export const Colorize = command({
  name: 'colorize',
  description:
    'Recolorize the discovered.json files with newest configuration.',
  args: {
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md.',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const chainConfigs = configReader
      .readAllDiscoveredProjects()
      .flatMap(({ project, chains }) =>
        chains.map((chain) => configReader.readConfig(project, chain)),
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

        updateDiffHistory(config.name, args.message)
      }
    }
  },
})
