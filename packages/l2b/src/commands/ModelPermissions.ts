import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
  modelPermissions,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'

export const ModelPermissions = command({
  name: 'model-permissions',
  args: {
    projectQuery: positional({
      type: string,
      displayName: 'projectQuery',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const chainConfigs = await Promise.all(
      configReader
        .readAllChainsForProject(args.projectQuery)
        .flatMap((chain) => configReader.readConfig(args.projectQuery, chain)),
    )
    for (const config of chainConfigs) {
      const discovery = configReader.readDiscovery(config.name, config.chain)
      const permissions = modelPermissions(
        config.structure,
        discovery,
        templateService,
      )
      console.dir(permissions, { depth: null })
    }
  },
})
