import { getDiscoveryPaths } from '@l2beat/discovery'
import { command, positional, string, subcommands } from 'cmd-ts'
import { analyseAllOpStackChains } from '../implementations/compareOpStacks'
import { discoveryPath } from './args'

const CompareSingleOpStackProjects = command({
  name: 'compare-op-stacks-all',
  description: 'Compare semantic versioning in all projects using the op stack',
  version: '1.0.0',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    discoveryPath,
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await analyseAllOpStackChains(args.project, paths)
  },
})

const CompareAllOpStackProjects = command({
  name: 'compare-op-stacks-all',
  description: 'Compare semantic versioning in all projects using the op stack',
  version: '1.0.0',
  args: { discoveryPath },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await analyseAllOpStackChains(null, paths)
  },
})

export const CompareOpStacks = subcommands({
  name: 'compare-op-stacks',
  description: 'Compare semantic versioning in projects using the op stack',
  cmds: {
    all: CompareAllOpStackProjects,
    single: CompareSingleOpStackProjects,
  },
})
