import { Layer2, Layer3 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import {
  DataAvailabilityPagesData,
  ScalingDataAvailabilityViewEntry,
} from '../types'
import { ScalingDataAvailabilityViewProps } from '../view/ScalingDataAvailabilityView'

export function getScalingDataAvailabilityView(
  projects: (Layer2 | Layer3)[],
  pagesData: DataAvailabilityPagesData,
): ScalingDataAvailabilityViewProps {
  const activeProjects = projects.filter(
    (p) => !p.isUpcoming || (p.type === 'layer2' && !p.isArchived),
  )
  const orderedByTvl = orderByTvl(activeProjects, pagesData.tvlApiResponse)

  return {
    items: orderedByTvl
      .map((p) => {
        const hasImplementationChanged =
          !!pagesData.implementationChange?.projects[p.id.toString()]
        return getScalingDataAvailabilityViewEntry(p, hasImplementationChanged)
      })
      .filter(notUndefined),
  }
}

function getScalingDataAvailabilityViewEntry(
  project: Layer2 | Layer3,
  hasImplementationChanged?: boolean,
): ScalingDataAvailabilityViewEntry | undefined {
  if (!project.dataAvailability) return

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    type: project.type,
    provider: project.display.provider,
    warning: project.display.warning,
    hasImplementationChanged,
    showProjectUnderReview: isAnySectionUnderReview(project),
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.type === 'layer2' ? project.stage : undefined,
    dataAvailability: {
      layer: project.dataAvailability.layer,
      bridge: project.dataAvailability.bridge,
      mode: project.dataAvailability.mode,
    },
  }
}
