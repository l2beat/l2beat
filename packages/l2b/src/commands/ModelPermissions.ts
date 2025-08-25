import {
  ConfigReader,
  getDiscoveryPaths,
  modelPermissionsCommand,
  TemplateService,
} from '@l2beat/discovery'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

export const ModelPermissions = command({
  name: 'model-permissions',
  description: 'Remodel permissions for given project with the newest config.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'Project name (without chain) or `all`',
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md',
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

    let projects = [args.project]
    if (args.project === 'all') {
      projects = configReader.readAllDiscoveredProjects()
    }
    for (const project of projects) {
      await modelPermissionsCommand(
        project,
        configReader,
        templateService,
        paths,
        args.debug,
      )
      updateDiffHistory(project, args.message)
    }
  },
})
