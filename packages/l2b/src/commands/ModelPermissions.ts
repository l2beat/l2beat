import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
  modelPermissionsCommand,
} from '@l2beat/discovery'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

export const ModelPermissions = command({
  name: 'model-permissions',
  args: {
    projectQuery: positional({
      type: string,
      displayName: 'projectQuery',
    }),
    debug: flag({
      type: boolean,
      long: 'debug',
      short: 'd',
      description: 'Keep debug Clingo files',
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
      await modelPermissionsCommand(
        project,
        configReader,
        templateService,
        paths,
        args.debug,
      )
      updateDiffHistory(project)
    }
  },
})
