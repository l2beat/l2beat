import { command, option } from 'cmd-ts'
import { ZkStackDataFetcher } from '../implementations/fetchZkStack'
import { HttpUrl } from './types'

export const FetchZkStack = command({
  name: 'fetchzkstack',
  description: 'Fetch and display information about zkStack L2s on Ethereum.',
  args: {
    rpcUrl: option({
      type: HttpUrl,
      env: 'L2B_RPC_URL',
      long: 'rpc-url',
      short: 'u',
      defaultValue: () => 'https://eth.drpc.org',
      defaultValueIsSerializable: true,
    }),
    outputPath: option({
      type: HttpUrl,
      long: 'output-path',
      short: 'o',
      defaultValue: () =>
        '../config/src/projects/shared-zk-stack/ethereum/l2b-fetchzkstack_output.json',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const fetcher = new ZkStackDataFetcher(args.rpcUrl, args.outputPath)
    await fetcher.fetchAndDisplayL2Data()
  },
})
