import { Layer2 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import {
  DataAvailabilityPagesData,
  ScalingDataAvailabilityViewEntry,
} from '../types'
import { ScalingDataAvailabilityViewProps } from '../view/ScalingDataAvailabilityView'

export function getScalingDataAvailabilityView(
  projects: Layer2[],
  pagesData: DataAvailabilityPagesData,
): ScalingDataAvailabilityViewProps {
  const activeProjects = projects.filter((p) => !p.isArchived && !p.isUpcoming)
  const orderedByTvl = orderByTvl(activeProjects, pagesData.tvlApiResponse)

  return {
    items: orderedByTvl
      .map((p) =>
        getScalingDataAvailabilityViewEntry(
          p,
          Object.prototype.hasOwnProperty.call(
            pagesData.implementationChange?.projects,
            p.id.toString(),
          ),
        ),
      )
      .filter(notUndefined),
  }
}

function getScalingDataAvailabilityViewEntry(
  project: Layer2,
  hasImplementationChanged?: boolean,
): ScalingDataAvailabilityViewEntry | undefined {
  if (!project.dataAvailability) return

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    warning: project.display.warning,
    hasImplementationChanged,
    showProjectUnderReview: isAnySectionUnderReview(project),
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.stage,
    dataAvailability: {
      layer: project.dataAvailability.layer,
      bridge: project.dataAvailability.bridge,
      mode: project.dataAvailability.mode,
    },
  }
}
