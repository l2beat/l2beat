import type { Project } from '@l2beat/config'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import type { CommonProjectEntry } from '../utils/getCommonProjectEntry'
import { getProjectIcon } from '../utils/getProjectIcon'

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
  const statuses = {
    underReview: project.statuses.reviewStatus
      ? ('config' as const)
      : undefined,
    syncWarning,
  }
  return {
    id: project.id,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href,
    tab: project.daLayer.systemCategory,
    backgroundColor: getRowBackgroundColor(statuses),
    statuses,
  }
}

export function getCommonDacDaEntry({
  project,
  syncWarning,
}: {
  project: Project<'customDa' | 'statuses'>
  syncWarning?: string
}): CommonDaEntry {
  const statuses = {
    underReview: project.statuses.reviewStatus
      ? ('config' as const)
      : undefined,
    syncWarning,
  }

  return {
    id: project.id,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    name: project.customDa.name ?? `${project.name} DAC`,
    nameSecondLine: project.customDa.type,
    href: `/scaling/projects/${project.slug}`,
    tab: 'custom',
    backgroundColor: getRowBackgroundColor(statuses),
    statuses,
  }
}
