import { command, option } from 'cmd-ts'
import path from 'path'
import { AgglayerDataFetcher } from '../implementations/fetchAgglayer'
import { File, HttpUrl } from './types'

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
      type: File,
      long: 'output-path',
      short: 'o',
      defaultValue: () =>
        '../config/src/projects/shared-polygon-cdk/ethereum/l2b-fetchagg_output.json',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    // Resolve the output path relative to the project root
    const projectRoot = process.cwd() // This will be the directory where the command is run
    const resolvedOutputPath = path.resolve(projectRoot, args.outputPath)

    const fetcher = new AgglayerDataFetcher(args.rpcUrl, resolvedOutputPath)
    await fetcher.fetchAndDisplayRollupData()
  },
})
