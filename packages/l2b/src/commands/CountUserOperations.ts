import { command, positional, string } from 'cmd-ts'
import { countUserOperations } from '../implementations/count-user-operations/countUserOperations'

export const CountUserOperations = command({
  name: 'count-user-operations',
  description: 'Count user operations present in calldata.',
  version: '1.0.0',
  args: {
    calldata: positional({ type: string, displayName: 'calldata' }),
  },
  handler: (args) => countUserOperations(args.calldata),
})
