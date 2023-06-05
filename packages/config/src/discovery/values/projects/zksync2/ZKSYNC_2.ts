import { ProjectPermission, ProjectRiskViewEntry } from '../../../../common'
import { RISK_VIEW } from '../../../../layer2s/common/riskView'
import { ProjectDiscovery } from '../../../ProjectDiscovery'

const discovery = new ProjectDiscovery('zksync2')
const stats = discovery.getMultisigStats(
  discovery.getAddressFromValue('zkSync', 'getGovernor').toString(),
)

const UPGRADEABILITY: ProjectRiskViewEntry = {
  ...RISK_VIEW.UPGRADABLE_YES,
  description: `The code that secures the system can be changed arbitrarily and without notice by the governor, that currently is a ${stats} Multisig. The governor can also change the Verifier contract without notice.`,
}

const SECURITY_COUNCIL: ProjectPermission = {
  name: 'Security Council',
  accounts: [],
  description:
    'Address capable of instant upgrade of the system. Currently set to zero address.',
}

export const ZKSYNC_2 = {
  UPGRADEABILITY,
  SECURITY_COUNCIL,
}
