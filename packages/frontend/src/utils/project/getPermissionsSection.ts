import { Bridge, Layer2 } from '@l2beat/config'

import { PermissionsSectionProps } from '../../components/project/PermissionsSection'

export function getPermissionsSection(
  project: Layer2 | Bridge,
): PermissionsSectionProps | undefined {
  return (
    project.permissions && {
      permissions: project.permissions,
    }
  )
}
