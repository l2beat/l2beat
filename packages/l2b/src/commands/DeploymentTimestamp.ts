import { command, option, positional } from 'cmd-ts'
import { providers } from 'ethers'
import { getContractCreationTimestamp } from '../implementations/rpcDeploymentFetch'
import { EthereumAddressValue, HttpUrl } from './types'

export const DeploymentTimestamp = command({
  name: 'deployment-timestamp',
  description: 'Gets the timestamp of a contract deployment.',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl: option({
      type: HttpUrl,
      env: 'L2B_RPC_URL',
      long: 'rpc-url',
      short: 'u',
      defaultValue: () => 'https://ethereum-rpc.publicnode.com',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const provider = new providers.StaticJsonRpcProvider(args.rpcUrl)
    const timestamp = await getContractCreationTimestamp(provider, args.address)
    if (timestamp === undefined) {
      console.log('Contract not found')
      return
    }
    const date = new Date(timestamp * 1000)
    console.log(date.toISOString())
    console.log(timestamp.toString())
  },
})
