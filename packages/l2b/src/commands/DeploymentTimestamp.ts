import { command, positional } from 'cmd-ts'
import { HttpUrl } from 'cmd-ts/batteries/url'
import { providers } from 'ethers'
import { getContractCreationTimestamp } from '../implementations/rpcDeploymentFetch'
import { EthereumAddressValue } from './types'

export const DeploymentTimestamp = command({
  name: 'deployment-timestamp',
  description: 'Gets the timestamp of a contract deployment',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl: positional({ type: HttpUrl, displayName: 'rpcUrl' }),
  },
  handler: async (args) => {
    const provider = new providers.StaticJsonRpcProvider(args.rpcUrl.toString())
    const timestamp = await getContractCreationTimestamp(provider, args.address)
    if (timestamp === undefined) {
      console.log('Contract not found')
      return
    }

    console.log(timestamp.toString())
  },
})
