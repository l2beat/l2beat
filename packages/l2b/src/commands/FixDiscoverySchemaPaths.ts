import { command } from 'cmd-ts'
import { lintJsonFiles } from '../implementations/fixDiscoverySchemaPaths'
import { getDiscoveryPaths } from '@l2beat/discovery'

export const FixDiscoverySchemaPaths = command({
  name: 'fix-discovery-schema-paths',
  description: 'Fix schema paths in discovery-related JSON(C) files.',
  version: '1.0.0',
  args: {},
  handler: () => {
    const paths = getDiscoveryPaths()
    lintJsonFiles(paths)
  },
})
