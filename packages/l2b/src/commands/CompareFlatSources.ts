import { getDiscoveryPaths } from '@l2beat/discovery'
import { CliLogger } from '@l2beat/shared'
import {
  boolean,
  command,
  flag,
  number,
  option,
  positional,
  string,
  subcommands,
} from 'cmd-ts'
import { executeCompareAll } from '../implementations/compare-flat-sources/executeCompareAll'
import { executeCompareProjects } from '../implementations/compare-flat-sources/executeCompareProjects'
import { executeCompareSourceOnSource } from '../implementations/compare-flat-sources/executeCompareSourceOnSource'
import { executeFindSimilar } from '../implementations/compare-flat-sources/executeFindSimilar'
import { discoveryPath } from './args'

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
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await executeCompareProjects({
      forceTable: args.forceTableFlag,
      firstProjectPath: args.firstProject,
      secondProjectPath: args.secondProject,
      paths,
      logger,
    })
  },
})

const CompareProjectSourceOnSource = command({
  name: 'compare-projects-source-on-source',
  description:
    'Given a project for each contract find the most similar among all projects.',
  args: {
    projectPath: positional({ type: string, displayName: 'projectPath' }),
    forceTableFlag,
    discoveryPath,
  },
  handler: async (args) => {
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await executeCompareSourceOnSource({
      forceTable: args.forceTableFlag,
      projectPath: args.projectPath,
      paths,
      logger,
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
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await executeFindSimilar({
      projectPath: args.project,
      forceTable: args.forceTableFlag,
      paths,
      logger,
    })
  },
})

const CompareAllFlatSources = command({
  name: 'compare-all-flat-sources',
  description: 'Compare similarities of all projects',
  version: '1.0.0',
  args: {
    discoveryPath,
    minProjectSimilarity: option({
      type: number,
      long: 'min-project-similarity',
      defaultValue: () => 0.4,
      defaultValueIsSerializable: true,
    }),
    minClusterSimilarity: option({
      type: number,
      long: 'min-cluster-similarity',
      defaultValue: () => 0.4,
      defaultValueIsSerializable: true,
    }),
    showGraph: flag({
      long: 'graph',
      short: 'g',
      defaultValue: () => false,
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    if (args.discoveryPath) {
      paths.discovery = args.discoveryPath
    }

    await executeCompareAll({
      minClusterSimilarity: args.minClusterSimilarity,
      minProjectSimilarity: args.minProjectSimilarity,
      showGraph: args.showGraph,
      paths,
      logger,
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
    ['source-on-source']: CompareProjectSourceOnSource,
  },
})
