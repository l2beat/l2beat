import type { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DiscoverCommandArgs,
  type DiscoveryModuleConfig,
  getChainConfig,
  getChainFullName,
  getChainShortName,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, option, optional, positional, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { discoverAndUpdateDiffHistory } from '../implementations/discovery/discoveryWrapper'

// NOTE(radomski): We need to modify the args object because the only allowed
// chains are those that we know of. But we also want to allow the user to
// specify "all" as the chain name.
const { project: _, chain: __, ...remainingArgs } = DiscoverCommandArgs
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
    const projectsOnChain: Record<string, string[]> = resolveProjects(
      args.projectQuery,
    )

    logProjectsToDiscover(projectsOnChain, logger)
    const timestamp = getTimestamp(args)

    for (const chainName in projectsOnChain) {
      const chain = getChainConfig(chainName)
      for (const project of projectsOnChain[chainName]) {
        const config: DiscoveryModuleConfig = {
          ...args,
          project,
          chain,
          timestamp: timestamp ?? args.timestamp,
        }

        await discoverAndUpdateDiffHistory(config, {
          logger,
          description: args.message,
        })
      }
    }
  },
})

function logProjectsToDiscover(
  projectsOnChain: Record<string, string[]>,
  logger: Logger,
) {
  if (Object.keys(projectsOnChain).length === 0) {
    logger.info(chalk.greenBright('Nothing to discover'))
    return
  }

  logger.info('Will discover')
  for (const chainName in projectsOnChain) {
    logger.info(chalk.blue(chainName))
    for (const project of projectsOnChain[chainName]) {
      logger.info(`  - ${chalk.yellowBright(project)}`)
    }
  }
}

function resolveProjects(projectQuery: string) {
  const result: Record<string, string[]> = {}
  const entries = configReader.readAllConfiguredProjects()

  const predicate: Predicate = EthereumAddress.check(projectQuery)
    ? addressPredicate
    : projectPredicate

  for (const { project, chains } of entries) {
    const matchingChains = chains.filter((chain) => {
      const query = EthereumAddress.check(projectQuery)
        ? ChainSpecificAddress.from(getChainShortName(chain), projectQuery)
        : projectQuery

      return predicate(query, project)
    })

    for (const chain of matchingChains) {
      if (!result[chain]) {
        result[chain] = []
      }
      result[chain].push(project)
    }
  }

  return result
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
  const address = ChainSpecificAddress(needleAddress)
  const chain = getChainFullName(ChainSpecificAddress.chain(address))
  const discovery = configReader.readDiscovery(haystackProject, chain)

  return discovery.entries.find((c) => c.address === address) !== undefined
}

// TODO(radomski): This will not exist. In the future all of this information
// will be stored in the discovery but since we're emulating having a single
// discovered.json we have to do this trick.
function getTimestamp(args: {
  timestamp: number | undefined
  dev: boolean
  dryRun: boolean
}): UnixTime | undefined {
  if (
    args.dev === false &&
    args.dryRun === false &&
    args.timestamp === undefined
  ) {
    return UnixTime.now()
  }

  return undefined
}
