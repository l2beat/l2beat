import { Bridge } from '@l2beat/config'

import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getNewsSection } from './getNewsSection'

export function getProjectDetails(bridge: Bridge): ProjectDetailsProps {
  return {
    newsSection: getNewsSection(bridge),
    linkSection: getLinkSection(bridge),
    descriptionSection: getDescriptionSection(bridge),
  }
}
