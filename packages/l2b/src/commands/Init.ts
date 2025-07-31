import { DiscoverCommandArgs } from '@l2beat/discovery'
import { command, positional, restPositionals, string } from 'cmd-ts'
import { initDiscovery } from '../implementations/init'
import { EthereumAddressValue } from './types'

const { chain } = DiscoverCommandArgs

export const Init = command({
  name: 'init',
  description: 'Creates a discovery project.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'name of the new project.',
    }),
    chain,
    initialAddresses: restPositionals({
      type: EthereumAddressValue,
      displayName: 'initialAddresses',
      description: 'a list of initial addresses.',
    }),
  },
  handler: (args) => {
    initDiscovery(args.project, args.chain, args.initialAddresses)
  },
})
