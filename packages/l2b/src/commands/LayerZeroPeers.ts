import { command, positional } from 'cmd-ts'
import { getLayerZeroPeers } from '../implementations/layerZeroPeers'
import { rpcUrl } from './args'
import { EthereumAddressValue } from './types'

export const GetLayerZeroPeers = command({
  name: 'get-layerzero-peers',
  description: 'Get layerzero peers information for a given contract.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
  },
  handler: async (args) => {
    await getLayerZeroPeers(args.address)
  },
})