import { CliLogger } from '@l2beat/shared'
import { command, positional } from 'cmd-ts'
import { getTokenMinterEvents } from '../implementations/tokenMinters'
import { explorerApiKey, explorerType, explorerUrl, rpcUrl } from './args'
import { EthereumAddressValue } from './types'

export const GetTokenMinters = command({
  name: 'get-token-minters',
  description: 'Get token minters information for a given contract',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl,
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
  },
  handler: async (args) => {
    const logger = new CliLogger()
    await getTokenMinterEvents(
      logger,
      args.address,
      args.rpcUrl,
      args.explorerUrl,
      args.apiKey,
      args.type,
    )
  },
})
