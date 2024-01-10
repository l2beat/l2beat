import { ScalingProjectRiskViewEntry } from '../../../../common'
import { RISK_VIEW } from '../../../../common/riskView'
import { ProjectDiscovery } from '../../../ProjectDiscovery'

const discovery = new ProjectDiscovery('zksync2')
const stats = discovery.getMultisigStats(
  discovery.getAddressFromValue('zkSync', 'getGovernor').toString(),
)

const UPGRADEABILITY: ScalingProjectRiskViewEntry = {
  ...RISK_VIEW.UPGRADABLE_YES,
  description: `The code that secures the system can be changed arbitrarily and without notice by the governor, that currently is a ${stats} Multisig. The governor can also change the Verifier contract without notice.`,
}

export const ZKSYNC_2 = {
  UPGRADEABILITY,
}
