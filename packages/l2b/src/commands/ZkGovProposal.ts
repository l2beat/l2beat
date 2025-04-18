// packages/l2b/src/commands/ZkGovProposal.ts
import { command, option, positional, string } from 'cmd-ts'
import { ZkGovProposalAnalyzer } from '../implementations/zkgovproposal'
import { Hash256Value, HttpUrl } from './types'
import { existsSync } from 'fs'
import path from 'path'

export const ZkGovProposal = command({
  name: 'zkgovproposal',
  description: 'Analyze ZKsync governance proposals and track their status across L2 and L1.',
  args: {
    proposalId: positional({ 
      type: string, 
      displayName: 'proposalId',
      description: 'ZKsync governance proposal ID to analyze' 
    }),
    l2RpcUrl: option({
      type: HttpUrl,
      env: 'ZKSYNC2_RPC_URL',
      long: 'l2-rpc-url',
      short: 'l',
      description: 'ZKsync Era (L2) RPC URL',
      defaultValue: () => 'https://mainnet.era.zksync.io',
      defaultValueIsSerializable: true,
    }),
    l1RpcUrl: option({
      type: HttpUrl,
      env: 'ETHEREUM_RPC_URL',
      long: 'l1-rpc-url',
      short: 'e',
      description: 'Ethereum (L1) RPC URL',
      defaultValue: () => 'https://eth.drpc.org',
      defaultValueIsSerializable: true,
    }),
    outputFile: option({
      type: HttpUrl,
      long: 'output',
      short: 'o',
      description: 'Optional markdown file path for output',
      defaultValue: () => '',
      defaultValueIsSerializable: true,
    }),
    executionDelay: option({
      type: HttpUrl,
      long: 'execution-delay',
      description: 'Delay in hours from L2 to L1 (default: 3)',
      defaultValue: () => '3',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const analyzer = new ZkGovProposalAnalyzer({
      l2RpcUrl: args.l2RpcUrl,
      l1RpcUrl: args.l1RpcUrl,
      executionDelay: parseInt(args.executionDelay),
      outputPath: args.outputFile
    })

    await analyzer.analyzeProposal(args.proposalId.toString())
  },
})
