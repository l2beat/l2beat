import { command, positional, string } from 'cmd-ts'
import { parseEigenDACommitment } from '../implementations/parse-eigenda-commitment/parse-eigenda-commitment'

export const ParseEigenDACommitment = command({
  name: 'parse-eigenda-commitment',
  description: 'Parses and prints a raw EigenDA commitment string.',
  version: '1.0.0',
  args: {
    commitment: positional({
      type: string,
      displayName: 'commitment',
      description: 'Raw EigenDA commitment hex string (with or without 0x prefix)',
    }),
  },
  handler: ({ commitment }) => {
    parseEigenDACommitment(commitment)
  },
})