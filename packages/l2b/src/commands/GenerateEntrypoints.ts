import {
  ConfigReader,
  generateEntrypoints,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { command } from 'cmd-ts'

export const GenerateEntrypoints = command({
  name: 'generate-entrypoints',
  description: 'Generate entrypoints to use for address sharing/referencing.',
  args: {},
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    await generateEntrypoints(configReader)
  },
})
