import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
  modelPermissionsForProject,
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
  handler: (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const permissions = modelPermissionsForProject(
      args.projectQuery,
      configReader,
      templateService,
    )
    console.log(permissions)
  },
})
