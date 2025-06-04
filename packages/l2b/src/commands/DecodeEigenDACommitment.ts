import { command, positional, string } from 'cmd-ts'
import { decodeEigenDACommitment } from '../implementations/decode-eigenda-commitment/decode-eigenda-commitment'

export const DecodeEigenDACommitment = command({
  name: 'decode-eigenda-commitment',
  description: 'Decodes the EigenDA commitment.',
  version: '1.0.0',
  args: {
    rpcUrl: positional({
      type: string,
      displayName: 'rpcUrl',
      description: 'Ethereum RPC URL',
    }),
    txHash: positional({ type: string, displayName: 'txHash' }),
  },
  handler: ({ rpcUrl, txHash }) => {
    decodeEigenDACommitment(rpcUrl, txHash)
  },
})
