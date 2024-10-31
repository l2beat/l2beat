import { readFileSync } from 'fs'
import path from 'path'
import { ProjectsVerificationStatuses } from '@l2beat/shared-pure'
import { unstable_noStore as noStore } from 'next/cache'
import { env } from '~/env'
import { cache } from '~/utils/cache'

export function getProjectsVerificationStatuses() {
  noStore()
  return getCachedProjectsVerificationStatuses()
}

const getCachedProjectsVerificationStatuses = cache(
  async () => {
    const projects = await readProjectsVerificationStatuses()
    return ProjectsVerificationStatuses.parse(projects)
  },
  ['projectsVerificationStatuses', env.VERCEL_GIT_COMMIT_SHA],
  // This is calculated from project files, so we can cache indefinitely for the same GIT_COMMIT_SHA.
  { revalidate: false },
)

function readProjectsVerificationStatuses(): unknown {
  const projects = readFileSync(
    path.join(process.cwd(), '../config/src/verification/projects.json'),
    'utf8',
  )
  return JSON.parse(projects) as unknown
}
