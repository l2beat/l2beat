import { readFileSync } from 'fs'
import path from 'path'
import { ProjectsVerificationStatuses } from '@l2beat/shared-pure'

export async function getProjectsVerificationStatuses() {
  const projects = await readProjectsVerificationStatuses()
  return ProjectsVerificationStatuses.parse(projects)
}

function readProjectsVerificationStatuses(): unknown {
  const projects = readFileSync(
    path.join(process.cwd(), '../config/src/verification/projects.json'),
    'utf8',
  )
  return JSON.parse(projects) as unknown
}
