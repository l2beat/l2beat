import type { ProjectCellProject } from '~/components/table/cells/ProjectNameCell'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

// Shared by every privacy table so warnings can't be forwarded in one and
// silently dropped in another.
export function toPrivacyProjectCellProject(entry: PrivacySummaryEntry) {
  return {
    name: entry.name,
    shortName: entry.shortName,
    slug: entry.slug,
    icon: entry.icon,
    detailsHref: entry.href,
    backgroundColor: entry.backgroundColor,
    description: entry.description,
    quantumResistance: entry.quantumResistant ? 'privacy' : undefined,
    statuses: {
      underReview: entry.isUnderReview ? 'config' : undefined,
      redWarning: entry.redWarning,
    },
  } as const satisfies ProjectCellProject
}
