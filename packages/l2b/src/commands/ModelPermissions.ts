
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

    let projects = [args.projectQuery]
    if (args.projectQuery === 'all') {
      projects = configReader
        .readAllChains()
        .flatMap((chain) => configReader.readAllProjectsForChain(chain))
    }
    for (const project of projects) {
      console.log(`Modelling: ${project}`)
      const facts = await modelPermissions(
        project,
        configReader,
        templateService,
        paths,
      )
      console.log(JSON.stringify(facts, null, 2))
    }
  },
})
