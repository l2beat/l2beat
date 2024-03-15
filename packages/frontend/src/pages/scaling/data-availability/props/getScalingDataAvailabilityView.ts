import { Layer2, ScalingProjectDataAvailability } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
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
      .map(getScalingDataAvailabilityViewEntry)
      .filter(notUndefined),
  }
}

function getScalingDataAvailabilityViewEntry(
  project: Layer2,
): ScalingDataAvailabilityViewEntry | undefined {
  if (!project.dataAvailability) return

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.stage,
    dataAvailability: {
      layer: getDataAvailabilityLayer(project.dataAvailability),
      bridge: project.dataAvailability.bridge,
      mode: project.dataAvailability.mode,
    },
  }
}

export function getDataAvailabilityLayer(da: ScalingProjectDataAvailability) {
  if (da.type === 'On chain') {
    return da.layer
  }

  if (!da.layers.values[1]) {
    return {
      ...da.layers,
      value: da.layers.values[0],
    }
  }

  return {
    ...da.layers,
    value: da.layers.values.join(' or '),
  }
}
