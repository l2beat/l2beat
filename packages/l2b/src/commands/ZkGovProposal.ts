import { command, option, positional, string } from 'cmd-ts'
import { ZkGovProposalAnalyzer } from '../implementations/zkgovproposal/zkgovproposal'
import { HttpUrl } from './types'

export const ZkGovProposal = command({
  name: 'zkgovproposal',
  description: 'Analyze a ZKsync governance proposal by ID.',
  args: {
    proposalId: positional({
      type: string,
      displayName: 'proposalId',
      description:
        'The ID of the governance proposal to analyze (e.g. from tally)',
    }),
    zksyncRpcUrl: option({
      type: HttpUrl,
      env: 'ZKSYNC2_RPC_URL',
      long: 'zksync-rpc',
      short: 'z',
      defaultValue: () => 'https://mainnet.era.zksync.io',
      defaultValueIsSerializable: true,
      description: 'ZKsync Era RPC URL',
    }),
    ethereumRpcUrl: option({
      type: HttpUrl,
      env: 'ETHEREUM_RPC_URL',
      long: 'ethereum-rpc',
      short: 'e',
      defaultValue: () => 'https://eth.drpc.org',
      defaultValueIsSerializable: true,
      description: 'Ethereum RPC URL',
    }),
    cacheDir: option({
      type: string,
      long: 'cache-dir',
      short: 'c',
      description: 'Directory to store cache files',
      defaultValue: () =>
        require('path').resolve(
          __dirname,
          '../../src/implementations/zkgovproposal/',
        ),
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const analyzer = new ZkGovProposalAnalyzer(
      args.zksyncRpcUrl,
      args.ethereumRpcUrl,
      args.cacheDir,
    )
    await analyzer.analyze(args.proposalId)
  },
})
