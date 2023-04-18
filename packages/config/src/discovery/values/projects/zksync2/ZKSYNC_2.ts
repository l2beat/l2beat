import { ProjectPermission, ProjectRiskViewEntry } from '../../../../common'
import { RISK_VIEW } from '../../../../layer2s/common/riskView'

const UPGRADEABILITY_STRING: ProjectRiskViewEntry = RISK_VIEW.UPGRADABLE_YES

const SECURITY_COUNCIL: ProjectPermission = {
  name: 'Security Council',
  accounts: [],
  description:
    'Address capable of instant upgrade of the system. Currently set to zero address.',
}

export const ZKSYNC_2 = {
  UPGRADEABILITY_STRING,
  SECURITY_COUNCIL,
}
