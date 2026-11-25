import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { runWatchCommand } from '../implementations/watch/runWatchCommand'

export const Watch = command({
  name: 'watch',
  description:
    'Runs a watch, writes its watched.json and an "Offchain changes" diffHistory.md entry. Pending items are never accepted.',
  args: {
    name: positional({
      type: string,
      displayName: 'name',
      description: 'a project with a watch.jsonc, or a global watch',
    }),
    dry: flag({
      type: boolean,
      long: 'dry',
      description: 'print the diff against main and write nothing',
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md',
    }),
  },
  handler: async (args) => {
    await runWatchCommand(
      args.name,
      { dry: args.dry, description: args.message },
      getPlainLogger(),
    )
  },
})
