import type { BaseProject } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { command, positional, string } from 'cmd-ts'
import { join } from 'path'

// e.g. `l2b getconfig base | jq 'del(.contracts, .permissions, .tvsConfig, .activityConfig, .trackedTxsConfig)' > base.config.json`

export const GetConfig = command({
  name: 'getconfig',
  description: 'Print the current processed config of a project as JSON.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
  },
  handler: async (args) => {
    const projects = loadProjects()
    const project = projects.find(
      (project) =>
        String(project.id) === args.project || project.slug === args.project,
    )

    assert(project, getProjectNotFoundMessage(args.project, projects))
    console.log(JSON.stringify(project, null, 2))
  },
})

function loadProjects(): BaseProject[] {
  try {
    const { getProjects } =
      require('@l2beat/config/build/processing/getProjects.js') as {
        getProjects: () => BaseProject[]
      }
    return getProjects()
  } catch (buildError) {
    try {
      const sourcePath = join(
        __dirname,
        '../../../config/src/processing/getProjects.ts',
      )
      const { getProjects } = require(sourcePath) as {
        getProjects: () => BaseProject[]
      }
      return getProjects()
    } catch (sourceError) {
      throw new AggregateError(
        [buildError, sourceError],
        'Unable to load processed project configs. Build @l2beat/config or run the command from the repository checkout.',
      )
    }
  }
}

function getProjectNotFoundMessage(
  projectName: string,
  projects: BaseProject[],
): string {
  const query = projectName.toLowerCase()
  const suggestions = [
    ...new Set(
      projects.flatMap((project) => [String(project.id), project.slug]),
    ),
  ]
    .filter((candidate) => candidate.toLowerCase().includes(query))
    .slice(0, 5)

  if (suggestions.length === 0) {
    return `Project "${projectName}" not found.`
  }

  return `Project "${projectName}" not found. Did you mean: ${suggestions.join(', ')}?`
}
