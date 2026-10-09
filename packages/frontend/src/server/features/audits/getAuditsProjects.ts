import { ps } from '~/server/projects'

/** Optional project fields the audits pages read next to the coverage. */
export const AUDITS_PROJECT_FIELDS = [
  'ossificationHistory',
  'chainConfig',
  'scalingInfo',
  'discoveryInfo',
  'defiInfo',
  'privacyInfo',
] as const

/** Every project with a committed audit-coverage.json. */
export function getAuditsProjects() {
  return ps.getProjects({
    select: ['auditCoverage'],
    optional: [...AUDITS_PROJECT_FIELDS],
  })
}

export function getAuditsProject(slug: string) {
  return ps.getProject({
    slug,
    select: ['auditCoverage'],
    optional: [...AUDITS_PROJECT_FIELDS],
  })
}
