import { assert } from '@l2beat/shared-pure'
import { command, positional, string, subcommands } from 'cmd-ts'
import { readConfig } from '../config/readConfig'
import {
  analyseAllOrbitChains,
  compareTwoOrbitChain,
} from '../implementations/compareOrbitStacks'
import { discoveryPath } from './args'

const CompareAllOrbitStackProjects = command({
  name: 'compare-orbit-stacks-all',
  description: 'Compare selected values in all projects using the orbit stack',
  version: '1.0.0',
  args: { discoveryPath },
  handler: async (args) => {
    const config = readConfig()
    const discoveryPath = config.discoveryPath ?? args.discoveryPath
    assert(discoveryPath !== undefined)

    await analyseAllOrbitChains(discoveryPath)
  },
})

const CompareTwoOrbitStackProjects = command({
  name: 'compare-orbit-stacks-two',
  description:
    'Compare selected values in between two specified project using the orbit stack',
  version: '1.0.0',
  args: {
    firstProject: positional({ type: string, displayName: 'firstProject' }),
    secondProject: positional({ type: string, displayName: 'secondProject' }),
    discoveryPath,
  },
  handler: async (args) => {
    const config = readConfig()
    const discoveryPath = config.discoveryPath ?? args.discoveryPath
    assert(discoveryPath !== undefined)

    await compareTwoOrbitChain(
      args.firstProject,
      args.secondProject,
      discoveryPath,
    )
  },
})

export const CompareOrbitStacks = subcommands({
  name: 'compare-orbit-stacks',
  description: 'Compare selected values in projects using the orbit stack',
  cmds: {
    all: CompareAllOrbitStackProjects,
    two: CompareTwoOrbitStackProjects,
  },
})
