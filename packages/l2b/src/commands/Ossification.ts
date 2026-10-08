import { ProjectService } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { measureOssification, type OssificationHistory } from '@l2beat/shared'
import { formatJson, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import { existsSync } from 'fs'
import { join } from 'path'

export const Ossification = command({
  name: 'ossification',
  description:
    'Prints the ossification history of a project, and the measurement made from it. Rebuild packages/config first.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    history: flag({
      type: boolean,
      long: 'history',
      description: 'print the derived perimeter and events instead',
    }),
  },
  handler: async (args) => {
    const history = await getHistory(args.project)
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

async function getHistory(
  project: string,
): Promise<OssificationHistory | undefined> {
  // An opted-in project's history is bounded by its project start and module
  // adoptions, which only its config knows.
  const config = await new ProjectService().getProject({
    id: ProjectId(project),
    optional: ['ossificationHistory'],
  })
  if (config?.ossificationHistory !== undefined) {
    return config.ossificationHistory
  }
  const discovered = join(
    getDiscoveryPaths().discovery,
    project,
    'discovered.json',
  )
  if (!existsSync(discovered)) return undefined
  const history = new ProjectDiscovery(project).getOssificationHistory()
  if (history !== undefined) {
    console.error(
      `${project} is not opted into ossification: derived from discovery without a project start`,
    )
  }
  return history
}
