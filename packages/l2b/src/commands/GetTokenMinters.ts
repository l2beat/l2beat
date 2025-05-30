import { CliLogger } from '@l2beat/shared'
import { command, positional } from 'cmd-ts'
import { getTokenMinterEvents } from '../implementations/tokenMinters'
import { rpcUrl } from './args'
import { EthereumAddressValue } from './types'

export const GetTokenMinters = command({
  name: 'get-token-minters',
  description: 'Get token minters information for a given contract.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl,
  },
  handler: async (args) => {
    const logger = new CliLogger()
    await getTokenMinterEvents(logger, args.address, args.rpcUrl)
  },
})
