import {
  command,
  number,
  option,
  optional,
  positional,
  restPositionals,
  string,
} from 'cmd-ts'
import { initDiscovery } from '../implementations/init'
import { EthereumAddressValue } from './types'

export const Init = command({
  name: 'init',
  description: 'Creates a discovery project.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'name of the new project.',
    }),
    chain: positional({
      type: string,
      displayName: 'chain',
      description: 'name of the chain.',
    }),
    initialAddresses: restPositionals({
      type: EthereumAddressValue,
      displayName: 'initialAddresses',
      description: 'a list of initial addresses.',
    }),
    maxAddresses: option({
      type: optional(number),
      long: 'max-addresses',
      short: 'm',
      description:
        'set maxAddresses on the scaffolded config. During the milestone-1 cleanup loop a low cap (30-100) is the recommended fail-fast guardrail.',
    }),
  },
  handler: (args) => {
    initDiscovery(
      args.project,
      args.chain,
      args.initialAddresses,
      args.maxAddresses,
    )
  },
})
