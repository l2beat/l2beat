import type { InteropIntentConfig, Project } from '@l2beat/config'

export type IntentProject = Project<'interopConfig'> & {
  interopConfig: Project<'interopConfig'>['interopConfig'] & {
    type: 'intent'
    intent: InteropIntentConfig
  }
}

export function getIntentProjects(
  projects: Project<'interopConfig'>[],
): IntentProject[] {
  const intentProjects: IntentProject[] = []

  for (const project of projects) {
    if (project.interopConfig.type !== 'intent') continue
    assertIntentProject(project)
    intentProjects.push(project)
  }

  return intentProjects.toSorted((a, b) => a.name.localeCompare(b.name))
}

function assertIntentProject(
  project: Project<'interopConfig'>,
): asserts project is IntentProject {
  if (project.interopConfig.type !== 'intent') {
    throw new Error(`Project ${project.id} is not an intent project.`)
  }
  if (!project.interopConfig.intent) {
    throw new Error(
      `Intent project ${project.id} is missing interopConfig.intent.`,
    )
  }
}
