import { getDiscoveryPaths } from '@l2beat/discovery'
import { command, positional, string, subcommands } from 'cmd-ts'
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
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await analyseAllOrbitChains(paths)
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
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await compareTwoOrbitChain(args.firstProject, args.secondProject, paths)
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
