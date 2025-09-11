import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { generateEntrypointsCommand } from '@l2beat/discovery/dist/discovery/shared-modules/generateEntrypoints'
import { command, positional, string } from 'cmd-ts'

export const GenerateEntrypoints = command({
  name: 'generate-entrypoints',
  description: 'Generate entrypoints to use for address sharing/referencing.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'Project name',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    await generateEntrypointsCommand(configReader, args.project)
  },
})
