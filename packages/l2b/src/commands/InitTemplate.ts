import { command, positional, string } from 'cmd-ts'
import { initTempalte } from '../implementations/initTemplate'

export const InitTemplate = command({
  name: 'init-template',
  description: 'Creates a new template',
  args: {
    name: positional({
      type: string,
      displayName: 'name',
      description:
        'name of the new template (e.g. "Oracle" or "myStack/Oracle")',
    }),
  },
  handler: (args) => {
    initTempalte(args.name)
  },
})
