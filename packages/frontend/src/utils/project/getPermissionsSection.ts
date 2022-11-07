import { Bridge, Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { PermissionsSectionProps } from '../../components/project/PermissionsSection'

export function getPermissionsSection(
  project: Layer2 | Bridge,
  verificationStatus: VerificationStatus,
): PermissionsSectionProps | undefined {
  return (
    project.permissions && {
      permissions: project.permissions,
      verificationStatus,
    }
  )
}
