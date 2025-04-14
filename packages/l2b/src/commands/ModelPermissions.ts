import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
  modelPermissions,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

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

    let projects = [args.projectQuery]
    if (args.projectQuery === 'all') {
      projects = configReader
        .readAllChains()
        .flatMap((chain) => configReader.readAllProjectsForChain(chain))
    }
    for (const project of projects) {
      console.log(`Modelling: ${project}`)
      const ultimatePermissions = await modelPermissions(
        project,
        configReader,
        templateService,
        paths,
      )
      const chainConfigs = configReader
        .readAllChainsForProject(project)
        .flatMap((chain) => configReader.readConfig(project, chain))
      for (const config of chainConfigs) {
        const discovery = configReader.readDiscovery(config.name, config.chain)
        for (const entry of discovery.entries) {
          const ultimatePermissionsForEntry = ultimatePermissions.filter((p) =>
            p.receiver.startsWith(`${config.chain}:${entry.address}`),
          )
          if (ultimatePermissionsForEntry.length > 0) {
            entry.permissions = ultimatePermissionsForEntry
          }
        }
        const projectDiscoveryFolder = configReader.getProjectChainPath(
          config.name,
          config.chain,
        )
        await saveDiscoveredJson(discovery, projectDiscoveryFolder)

        updateDiffHistory(config.name, config.chain)
      }
    }
  },
})
