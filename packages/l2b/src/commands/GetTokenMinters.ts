import { command, positional } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
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
    const logger = getPlainLogger()
    await getTokenMinterEvents(logger, args.address, args.rpcUrl)
  },
})
