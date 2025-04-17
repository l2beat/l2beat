import { command, positional, option } from 'cmd-ts'
import { decodeZkGovProposal } from '../implementations/zkgovproposal'
import { HttpUrl } from './types' // same helper used by the other commands

export const ZkGovProposal = command({
  name: 'zkgovproposal',
  description:
    'Analyse a ZKsync Era governance proposal and (optionally) its L1 upgrade.',
  args: {
    /** mandatory */
    proposalId: positional({ type: String, displayName: 'PROPOSAL_ID' }),

    /** optional overrides so you don’t have to touch .env every time */
    l2RpcUrl: option({
      type: HttpUrl,
      long: 'l2-rpc-url',
      short: 'l2',
      env: 'ZKSYNC2_RPC_URL',
      description: 'ZKsync Era RPC endpoint',
      defaultValue: () => undefined,
      defaultValueIsSerializable: true,
    }),
    l1RpcUrl: option({
      type: HttpUrl,
      long: 'l1-rpc-url',
      short: 'l1',
      env: 'ETHEREUM_RPC_URL',
      description: 'Ethereum (L1) RPC endpoint',
      defaultValue: () => undefined,
      defaultValueIsSerializable: true,
    }),
  },

  handler: async ({ proposalId, l2RpcUrl, l1RpcUrl }) => {
    await decodeZkGovProposal(proposalId, { l2RpcUrl, l1RpcUrl })
  },
})
