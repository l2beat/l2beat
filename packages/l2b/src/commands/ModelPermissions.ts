import {
  ConfigReader,
  TemplateService,
  buildProjectPageFacts,
  getDiscoveryPaths,
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

    const facts = await buildProjectPageFacts(
      args.projectQuery,
      configReader,
      templateService,
      paths,
    )
    console.log(JSON.stringify(facts, null, 2))
  },
})
