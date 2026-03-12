import { type BaseProject, ProjectService } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { command, positional, string } from 'cmd-ts'

// e.g. `l2b getconfig base | jq 'del(.contracts, .permissions, .tvsConfig, .activityConfig, .trackedTxsConfig)' > base.config.json`

export const GetConfig = command({
  name: 'getconfig',
  description: 'Print the current processed config of a project as JSON.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
  },
  handler: async (args) => {
    const ps = new ProjectService()
    const [project, allProjects] = await Promise.all([
      ps.getProject({ id: ProjectId(args.project) }),
      ps.getProjects({ select: ['display'] }),
    ])

    assert(project, getProjectNotFoundMessage(args.project, allProjects))
    console.log(JSON.stringify(project, null, 2))
  },
})

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

  const buildCallout =
    "If you've just added a project, please rebuild config package."
  if (suggestions.length === 0) {
    return `Project "${projectName}" not found. ${buildCallout}`
  }

  return `Project "${projectName}" not found. Did you mean: ${suggestions.join(', ')}? ${buildCallout}`
}
