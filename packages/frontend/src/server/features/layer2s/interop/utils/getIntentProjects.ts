import type { Project } from '@l2beat/config'

export type IntentProject = Project<'interopConfig'> & {
  interopConfig: Extract<
    Project<'interopConfig'>['interopConfig'],
    { type: 'intent' }
  >
}

export function getIntentProjects(
  projects: Project<'interopConfig'>[],
): IntentProject[] {
  return projects
    .filter(isIntentProject)
    .toSorted((a, b) => a.name.localeCompare(b.name))
}

function isIntentProject(
  project: Project<'interopConfig'>,
): project is IntentProject {
  return project.interopConfig.type === 'intent'
}
