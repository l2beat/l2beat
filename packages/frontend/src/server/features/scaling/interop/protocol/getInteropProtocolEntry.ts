import type { Project, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropSelection } from '~/pages/interop/utils/types'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'

export interface InteropProtocolEntry {
  id: ProjectId
  name: string
  shortName: string | undefined
  slug: string
  icon: string
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: ProjectRedWarning
    emergencyWarning?: string
    description?: string
    badges?: BadgeWithParams[]
    links?: ProjectLink[]
    hostChain?: string
  }
  sections: ProjectDetailsSection[]
}

export async function getInteropProtocolEntry(
  project: Project<'interopConfig', 'display' | 'statuses'>,
  helpers: SsrHelpers,
  apiSelection: InteropSelection,
): Promise<InteropProtocolEntry> {
  const header: InteropProtocolEntry['header'] = {
    description: project.display?.description,
    warning: project.statuses?.yellowWarning,
    redWarning: project.statuses?.redWarning,
    emergencyWarning: project.statuses?.emergencyWarning,
    links: project.display?.links
      ? getProjectLinks(project.display.links)
      : undefined,
  }

  const common = {
    id: project.id,
    name: project.interopConfig?.name ?? project.name,
    shortName: project.shortName,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses?.reviewStatus,
      impactfulChange: false,
    }),
    header,
  }

  const sections: ProjectDetailsSection[] = []

  const data = await helpers.interop.protocol.fetch({
    id: project.id,
    ...apiSelection,
  })
  if (data.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        projectId: project.id,
        title: 'Volume and flows',
      },
    })
  }

  sections.push({
    type: 'InteropTokensSection',
    props: {
      id: 'interop-tokens',
      projectId: project.id,
      title: 'Top tokens by volume',
    },
  })

  sections.push({
    type: 'InteropTransfersSection',
    props: {
      id: 'interop-transfers',
      projectId: project.id,
      title: 'Transfers',
    },
  })

  return { ...common, sections }
}
