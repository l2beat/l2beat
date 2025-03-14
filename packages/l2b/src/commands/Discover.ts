import {
  ConfigReader,
  DiscoverCommandArgs,
  type DiscoveryModuleConfig,
  getChainConfig,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, option, optional, positional, string } from 'cmd-ts'
import { discoverAndUpdateDiffHistory } from '../implementations/discovery/discoveryWrapper'

// NOTE(radomski): We need to modify the args object because the only allowed
// chains are those that we know of. But we also want to allow the user to
// specify "all" as the chain namas the chain name.
const { project, chain, ...remainingArgs } = DiscoverCommandArgs
const args = {
  ...remainingArgs,
  chainQuery: positional({
    type: string,
    displayName: 'chainQuery',
    description: DiscoverCommandArgs.chain.description,
  }),
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
  description: 'User interface to discover projects located in discovery',
  args,
  handler: async (args) => {
    const projectsOnChain: Record<string, string[]> = resolveProjectsOnChain(
      args.projectQuery,
      args.chainQuery,
    )

    logProjectsToDiscover(projectsOnChain)

    for (const chainName in projectsOnChain) {
      const chain = getChainConfig(chainName)
      for (const project of projectsOnChain[chainName]) {
        const config: DiscoveryModuleConfig = {
          ...args,
          project,
          chain,
        }

        await discoverAndUpdateDiffHistory(config, args.message)
      }
    }
  },
})

function logProjectsToDiscover(projectsOnChain: Record<string, string[]>) {
  if (Object.keys(projectsOnChain).length === 0) {
    console.log(chalk.greenBright('Nothing to discover'))
    return
  }

  console.log('Will discover')
  for (const chainName in projectsOnChain) {
    console.log(chalk.blue(chainName))
    for (const project of projectsOnChain[chainName]) {
      console.log(`  - ${chalk.yellowBright(project)}`)
    }
  }
}

function resolveProjectsOnChain(projectQuery: string, chainQuery: string) {
  const result: Record<string, string[]> = {}

  const chains: string[] = []
  if (chainQuery === 'all') {
    chains.push(...configReader.readAllChains())
  } else {
    chains.push(chainQuery)
  }

  for (const chain of chains) {
    const projects = resolveProjects(projectQuery, chain)
    if (projects.length > 0) {
      result[chain] = projects
    }
  }

  return result
}

type Predicate = (
  needle: string,
  haystackProject: string,
  haystackChain: string,
) => boolean

function resolveProjects(projectQuery: string, chain: string): string[] {
  const allProjects = configReader.readAllProjectsForChain(chain)
  const predicate: Predicate = EthereumAddress.check(projectQuery)
    ? addressPredicate
    : projectPredicate

  return allProjects.filter((p) => predicate(projectQuery, p, chain))
}

function projectPredicate(
  needleProject: string,
  haystackProject: string,
  _: string,
): boolean {
  return needleProject === haystackProject
}

function addressPredicate(
  needleAddress: string,
  haystackProject: string,
  haystackChain: string,
): boolean {
  const discovery = configReader.readDiscovery(haystackProject, haystackChain)

  return (
    discovery.entries.find((c) => c.address === needleAddress) !== undefined
  )
}
