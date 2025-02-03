import type { ProjectPermission } from '../../types'
import type { ProjectDiscovery } from '../ProjectDiscovery'

export function getCommittee(
  discovery: ProjectDiscovery,
  committeeName = 'Committee',
  name = 'Data Availability Committee',
): [ProjectPermission, number, number] {
  const minSigners = Number(
    discovery.getConstructorArg<string>(committeeName, 1),
  )
  const accounts = discovery.formatPermissionedAccounts(
    discovery.getConstructorArg<string[]>(committeeName, 0),
  )
  const minAssumedHonestMembers = accounts.length - minSigners + 1

  return [
    discovery.getPermissionDetails(
      name,
      accounts,
      `Validity proof must be signed by at least ${minSigners} of these addresses to approve state update.`,
    ),
    minSigners,
    minAssumedHonestMembers,
  ]
}
