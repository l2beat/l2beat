import { ScalingProjectRiskViewEntry } from '../../../../common'
import { RISK_VIEW } from '../../../../common/riskView'
import { ProjectDiscovery } from '../../../ProjectDiscovery'

const discovery = new ProjectDiscovery('zksync2')
const governor = discovery
  .getAddressFromValue('zkSync', 'getGovernor')
  .toString()
const upgradeMinDelay = discovery.getContractValue<number>(governor, 'minDelay')
const stats = discovery.getMultisigStats(
  discovery.getContractValue(governor, 'owner'),
)

const UPGRADEABILITY: ScalingProjectRiskViewEntry = {
  ...RISK_VIEW.UPGRADABLE_YES,
  description: `The code that secures the system can be changed arbitrarily and ${
    upgradeMinDelay === 0 ? 'without' : `with ${upgradeMinDelay} seconds`
  } notice by the governor, that currently is owned by a ${stats} Multisig. The governor can also change the Verifier contract without notice.`,
}

export const ZKSYNC_2 = {
  UPGRADEABILITY,
}
