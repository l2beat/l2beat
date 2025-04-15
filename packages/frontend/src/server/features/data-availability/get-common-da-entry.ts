import type { Project } from '@l2beat/config'
import type { CommonProjectEntry } from '../utils/get-common-project-entry'

export interface CommonDaEntry extends CommonProjectEntry {
  tab: 'public' | 'custom'
  href: string | undefined
}

export function getCommonDaEntry({
  project,
  href,
  syncWarning,
}: {
  project: Project<'daLayer' | 'statuses'>
  href: string | undefined
  syncWarning?: string
}): CommonDaEntry {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href,
    tab: project.daLayer.systemCategory,
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
      syncWarning,
    },
  }
}

export function getCommonDacDaEntry({
  project,
  syncWarning,
}: {
  project: Project<'customDa' | 'statuses'>
  syncWarning?: string
}): CommonDaEntry {
  return {
    id: project.id,
    slug: project.slug,
    name: project.customDa.name ?? `${project.name} DAC`,
    nameSecondLine: project.customDa.type,
    href: `/scaling/projects/${project.slug}`,
    tab: 'custom',
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
      syncWarning,
    },
  }
}
