import { Bridge } from '@l2beat/config'

import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDescriptionSection(bridge: Bridge): DescriptionSectionProps {
  return {
    issueLink: getIssueLink(`Problem: ${bridge.display.name} project page`),
    editLink: getEditLink(bridge),
    warning: undefined,
    description: bridge.display.description ?? '',
  }
}
