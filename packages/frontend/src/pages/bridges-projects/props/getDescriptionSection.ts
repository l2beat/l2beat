import { Bridge } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDescriptionSection(
  bridge: Bridge,
  verificationStatus: VerificationStatus,
): DescriptionSectionProps {
  return {
    issueLink: getIssueLink(`Problem: ${bridge.display.name} project page`),
    editLink: getEditLink(bridge),
    warning: bridge.display.warning,
    isVerified: verificationStatus.projects[bridge.id.toString()],
    description: bridge.display.description ?? '',
  }
}
