import {
  ConfigReader,
  DiscoverCommandArgs,
  DiscoveryModuleConfig,
  getChainConfig,
} from '@l2beat/discovery'

import { command, positional, run, string } from 'cmd-ts'
import { discoverAndUpdateDiffHistory } from './discoveryWrapper'

// NOTE(radomski): We need to modify the args object because the only allowed
// chains are those that we know of. But we also want to allow the user to
// specify "all" as the chain namas the chain name.
const args = {
  ...DiscoverCommandArgs,
  chain: positional({
    type: string,
    description: DiscoverCommandArgs.chain.description,
  }),
}

const cmd = command({
  name: 'discover',
  args,
  handler: async (args) => {
    const chainNames: string[] = []
    if (args.chain === 'all') {
      const configReader = new ConfigReader()
      chainNames.push(...configReader.readAllChainsForProject(args.project))
    } else {
      chainNames.push(args.chain)
    }

    for (const chainName of chainNames) {
      const chain = getChainConfig(chainName)
      const config: DiscoveryModuleConfig = {
        ...args,
        chain,
      }

      await discoverAndUpdateDiffHistory(config)
    }
  },
})

run(cmd, process.argv.slice(2))
