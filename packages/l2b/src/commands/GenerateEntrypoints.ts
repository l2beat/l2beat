import {
  ConfigReader,
  generateEntrypoints,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'

export const GenerateEntrypoints = command({
  name: 'generate-entrypoints',
  description: 'Generate entrypoints to use for address sharing/referencing.',
  args: {
    chain: positional({
      type: string,
      displayName: 'chain',
      description: 'Chain name',
    }),
    project: positional({
      type: string,
      displayName: 'project',
      description: 'Project name',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    await generateEntrypoints(configReader, args.chain, args.project)
  },
})
