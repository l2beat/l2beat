import type { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DiscoverCommandArgs,
  type DiscoveryModuleConfig,
  type EntryParameters,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, option, optional, positional, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { discoverAndUpdateDiffHistory } from '../implementations/discovery/discoveryWrapper'

// NOTE(radomski): We need to modify the args object because the only allowed
// chains are those that we know of. But we also want to allow the user to
// specify "all" as the chain name.
const { project: _, ...remainingArgs } = DiscoverCommandArgs
const args = {
  ...remainingArgs,
  projectQuery: positional({
    type: string,
    displayName: 'projectQuery',
    description: `${DiscoverCommandArgs.project.description} or an address, projects containing that address will be discovered`,
  }),
  message: option({
    type: optional(string),
    long: 'message',
    short: 'm',
    description:
      'Message that will be written in the description section of diffHistory.md',
  }),
}

const paths = getDiscoveryPaths()
const configReader = new ConfigReader(paths.discovery)

export const Discover = command({
  name: 'discover',
  description: 'User interface to discover projects located in discovery.',
  args,
  handler: async (args) => {
    const logger = getPlainLogger()
    const matchingProjects = resolveProjects(args.projectQuery)

    logProjectsToDiscover(matchingProjects, logger)

    for (const project of matchingProjects) {
      const config: DiscoveryModuleConfig = { ...args, project }

      await discoverAndUpdateDiffHistory(config, {
        logger,
        configReader,
        description: args.message,
      })
    }
  },
})

function logProjectsToDiscover(projects: string[], logger: Logger) {
  if (projects.length === 0) {
    logger.info(chalk.greenBright('Nothing to discover'))
    return
  }

  logger.info('Will discover')
  for (const project of projects) {
    logger.info(`${chalk.blue(project)}`)
  }
}

function resolveProjects(projectQuery: string): string[] {
  const entries = configReader.readAllConfiguredProjects()

  const isChainSpecificAddressPredicate =
    ChainSpecificAddress.check(projectQuery)
  const isAddressPredicate = EthereumAddress.check(projectQuery)

  const predicate: Predicate = isChainSpecificAddressPredicate
    ? chainSpecificAddressPredicate
    : isAddressPredicate
      ? addressPredicate
      : projectPredicate

  const matchingProjects: string[] = []
  for (const project of entries) {
    const query = isAddressPredicate
      ? EthereumAddress(projectQuery)
      : projectQuery
    const projectMatches = predicate(query, project)

    if (projectMatches) {
      matchingProjects.push(project)
    }
  }

  return matchingProjects
}

type Predicate = (needle: string, haystackProject: string) => boolean

function projectPredicate(
  needleProject: string,
  haystackProject: string,
): boolean {
  return needleProject === haystackProject
}

function addressPredicate(
  needleAddress: string,
  haystackProject: string,
): boolean {
  const address = EthereumAddress(needleAddress)
  const entries = getEntries(haystackProject)

  return (
    entries.find((c) => ChainSpecificAddress.address(c.address) === address) !==
    undefined
  )
}

function chainSpecificAddressPredicate(
  needleAddress: string,
  haystackProject: string,
): boolean {
  const address = ChainSpecificAddress(needleAddress)
  const entries = getEntries(haystackProject)

  return entries.find((c) => c.address === address) !== undefined
}

function getEntries(project: string): EntryParameters[] {
  try {
    const discovery = configReader.readDiscovery(project)
    return discovery.entries
  } catch {
    return []
  }
}
