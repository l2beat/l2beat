import { assert } from '@l2beat/shared-pure'
import { command, positional, string, subcommands } from 'cmd-ts'
import { readConfig } from '../config/readConfig'
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
    const config = readConfig()
    const discoveryPath = config.discoveryPath ?? args.discoveryPath
    assert(discoveryPath !== undefined)

    await analyseAllOpStackChains(args.project, discoveryPath)
  },
})

const CompareAllOpStackProjects = command({
  name: 'compare-op-stacks-all',
  description: 'Compare semantic versioning in all projects using the op stack',
  version: '1.0.0',
  args: { discoveryPath },
  handler: async (args) => {
    const config = readConfig()
    const discoveryPath = config.discoveryPath ?? args.discoveryPath
    assert(discoveryPath !== undefined)

    await analyseAllOpStackChains(null, discoveryPath)
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
