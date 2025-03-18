import { command, option } from 'cmd-ts'
import { AgglayerDataFetcher } from '../implementations/fetchAgglayer'
import { HttpUrl } from './types'

export const FetchAgglayer = command({
  name: 'fetchagg',
  description:
    'Fetch and display information about rollups from the Polygon Aggregation Layer.',
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
      defaultValue: () => './fetchAgglayer_output.json',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const fetcher = new AgglayerDataFetcher(args.rpcUrl, args.outputPath)
    await fetcher.fetchAndDisplayRollupData()
  },
})
