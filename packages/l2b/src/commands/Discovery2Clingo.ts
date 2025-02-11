import { ClingoExporter } from '@l2beat/config'
import { command, positional, string } from 'cmd-ts'

export const Discovery2Clingo = command({
  name: 'discovery2clingo',
  description: 'Builds a clingo file based on discovered.jsonc.',
  version: '1.0.0',
  args: {
    chain: positional({
      type: string,
      displayName: 'chain',
      description: 'name of the chain on which discovery will happen',
    }),
    project: positional({
      type: string,
      displayName: 'project',
      description: 'name of the project which will be discovered',
    }),
  },
  handler: (args) => {
    const clingoExporter = new ClingoExporter(args.project, args.chain)
    clingoExporter.saveClingo()
  },
})
