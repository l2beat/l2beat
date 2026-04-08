import { command, option, optional, restPositionals, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { runFlattenSnapshots } from '../implementations/flatten-snapshots'
import { ChainSpecificAddressValue } from './types'

export const FlattenSnapshots = command({
  name: 'flatten-snapshots',
  description:
    'Flatten, compile, and verify bytecode for discovery contracts. Defaults to taiko, scroll, arbitrum, base, optimism.',
  args: {
    projects: restPositionals({
      type: string,
      displayName: 'projects',
      description:
        'Optional project names. If omitted, uses taiko, scroll, arbitrum, base, optimism.',
    }),
    address: option({
      type: optional(ChainSpecificAddressValue),
      long: 'address',
      short: 'a',
      description:
        'Optional chain-specific address to verify within the selected projects.',
    }),
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    await runFlattenSnapshots(logger, args.projects, args.address)
  },
})
