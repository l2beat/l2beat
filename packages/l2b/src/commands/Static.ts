import { command, option, optional, positional, string } from 'cmd-ts'
import { staticAudit } from '../implementations/staticAudit'

export const Static = command({
  name: 'static',
  description:
    'Run a slither-backed audit on a Solidity file and emit a machine-' +
    'readable JSON report. Per external/public entry point: visibility, ' +
    'mutability, transitive state writes/reads, transitive external calls ' +
    'with library marking, transitive msg.sender guards (modifier-aware ' +
    'with arguments), transitive internal-call set. Plus the contract ' +
    'state-variable inventory.',
  args: {
    file: positional({
      type: string,
      displayName: 'file.sol',
      description: 'Solidity file to analyze (flat or single-file).',
    }),
    out: option({
      type: optional(string),
      long: 'out',
      short: 'o',
      description: 'Write JSON to this path instead of stdout.',
    }),
  },
  handler: ({ file, out }) => staticAudit(file, out),
})
