import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { measureOssification } from '@l2beat/shared'
import { formatJson, UnixTime } from '@l2beat/shared-pure'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import { existsSync } from 'fs'
import { join } from 'path'

export const Ossification = command({
  name: 'ossification',
  description:
    'Prints the ossification history derived from discovery for a project, and the measurement made from it. Rebuild packages/config first.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    history: flag({
      type: boolean,
      long: 'history',
      description: 'print the derived perimeter and events instead',
    }),
  },
  handler: (args) => {
    const discovered = join(
      getDiscoveryPaths().discovery,
      args.project,
      'discovered.json',
    )
    const history = existsSync(discovered)
      ? new ProjectDiscovery(args.project).getOssificationHistory()
      : undefined
    if (history === undefined) {
      console.log(`${args.project} has no critical perimeter`)
      return
    }
    const output = args.history
      ? history
      : measureOssification(history, UnixTime.now())
    console.log(formatJson(output))
  },
})
