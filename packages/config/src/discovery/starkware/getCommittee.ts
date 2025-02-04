import type { ProjectPermission } from '../../types'
import type { ProjectDiscovery } from '../ProjectDiscovery'

export interface CommitteeResult {
  committeePermission: ProjectPermission
  minSigners: number
  minAssumedHonestMembers: number
}

export function getCommittee(
  discovery: ProjectDiscovery,
  committeeName = 'Committee',
  name = 'Data Availability Committee',
): CommitteeResult {
  const minSigners = Number(
    discovery.getConstructorArg<string>(committeeName, 1),
  )
  const accounts = discovery.formatPermissionedAccounts(
    discovery.getConstructorArg<string[]>(committeeName, 0),
  )

  return {
    committeePermission: discovery.getPermissionDetails(
      name,
      accounts,
      `Validity proof must be signed by at least ${minSigners} of these addresses to approve state update.`,
    ),
    minSigners,
    minAssumedHonestMembers: accounts.length - minSigners + 1,
  }
}
