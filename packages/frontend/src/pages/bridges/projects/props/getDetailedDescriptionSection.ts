import { Bridge } from '@l2beat/config'

import { DetailedDescriptionSectionProps } from '../../../../components/project/DetailedDescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDetailedDescriptionSection(
  bridge: Bridge,
): DetailedDescriptionSectionProps {
  return {
    id: 'detailed-description',
    title: 'Detailed description',
    issueLink: getIssueLink(`Problem: ${bridge.display.name} project page`),
    editLink: getEditLink(bridge),
    description: bridge.display.description,
    detailedDescription: bridge.display.detailedDescription,
  }
}
