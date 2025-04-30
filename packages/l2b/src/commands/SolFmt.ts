import { command, positional, string } from 'cmd-ts'
import { solFmt } from '../implementations/solFmt'

export const SolFmt = command({
  name: 'sol-fmt',
  description: 'Format solidity source code.',
  args: {
    fileOrDir: positional({
      type: string,
      displayName: 'path',
      description: 'file or directory to format.',
    }),
  },
  handler: ({ fileOrDir }) => {
    solFmt(fileOrDir)
  },
})
