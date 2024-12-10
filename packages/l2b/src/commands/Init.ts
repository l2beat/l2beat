import { command, positional, restPositionals, string } from 'cmd-ts'
import { EthereumAddressValue } from './types'
import { DiscoverCommandArgs } from '@l2beat/discovery'
import { initDiscovery } from '../implementations/init'

const { chain } = DiscoverCommandArgs

export const Init = command({
  name: 'init',
  description: 'Creates a discovery project',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'name of the new project',
    }),
    chain,
    initialAddresses: restPositionals({
      type: EthereumAddressValue,
      displayName: 'initalAddresses',
      description: 'a list of initial addresses',
    }),
  },
  handler: (args) => {
      initDiscovery(args.project, args.chain, args.initialAddresses)
  },
})
