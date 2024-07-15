import { boolean, command, flag, positional, string, subcommands } from 'cmd-ts'
import { executeCompareAll } from '../implementations/compare-flat-sources/executeCompareAll'
import { executeCompareProjects } from '../implementations/compare-flat-sources/executeCompareProjects'
import { executeFindSimilar } from '../implementations/compare-flat-sources/executeFindSimilar'
import { discoveryPath } from './args'
import { ProjectStack } from './types'

const forceTableFlag = flag({
  description:
    'Force the table to be displayed even if the terminal is too small',
  type: boolean,
  long: 'force-table',
  short: 'f',
  defaultValue: () => false,
})

const CompareProjectSources = command({
  name: 'compare-project-sources',
  description: 'Compare similarities between flat contracts of two projects',
  version: '1.0.0',
  args: {
    firstProject: positional({ type: string, displayName: 'firstProject' }),
    secondProject: positional({ type: string, displayName: 'secondProject' }),
    forceTableFlag,
    discoveryPath,
  },
  handler: async (args) => {
    await executeCompareProjects({
      forceTable: args.forceTableFlag,
      firstProjectPath: args.firstProject,
      secondProjectPath: args.secondProject,
      discoveryPath: args.discoveryPath,
    })
  },
})

const MostSimilarFlatSources = command({
  name: 'most-similar-flat-sources',
  description: 'Compare and find the most similar project to the one given',
  version: '1.0.0',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    forceTableFlag,
    discoveryPath,
  },
  handler: async (args) => {
    await executeFindSimilar({
      projectPath: args.project,
      discoveryPath: args.discoveryPath,
      forceTable: args.forceTableFlag,
    })
  },
})

const CompareAllFlatSources = command({
  name: 'compare-all-flat-sources',
  description: 'Compare similarities of all projects using a given stack',
  version: '1.0.0',
  args: {
    stack: positional({ type: ProjectStack, displayName: 'stack' }),
    forceTableFlag,
    discoveryPath,
  },
  handler: async (args) => {
    await executeCompareAll({
      stack: args.stack,
      forceTable: args.forceTableFlag,
      discoveryPath: args.discoveryPath,
    })
  },
})

export const CompareFlatSources = subcommands({
  name: 'compare-flat-sources',
  description: 'Compare project similarities based on flat sources',
  cmds: {
    all: CompareAllFlatSources,
    similar: MostSimilarFlatSources,
    project: CompareProjectSources,
  },
})
