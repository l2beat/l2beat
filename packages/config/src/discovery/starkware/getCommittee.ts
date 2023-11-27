import { ProjectDiscovery } from '../ProjectDiscovery'

export function getCommittee(
  discovery: ProjectDiscovery,
  committeeName = 'Committee',
  name = 'Data Availability Committee',
) {
  const accounts = discovery
    .getConstructorArg<string[]>(committeeName, 0)
    .map(discovery.formatPermissionedAccount.bind(discovery))

  const minSigners = discovery.getConstructorArg<string>(committeeName, 1)
  return {
    name,
    accounts,
    description: `Validity proof must be signed by at least ${minSigners} of these addresses to approve state update.`,
  }
}
