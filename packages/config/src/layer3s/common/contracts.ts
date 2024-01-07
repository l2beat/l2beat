import { ProjectContracts, ProjectRisk } from '../../common'
import { formatSeconds } from '../../utils/formatSeconds'
import { DANGER_DELAY_THRESHOLD_SECONDS } from './constants'

const UPGRADE_NO_DELAY_RISK: ProjectRisk = {
    category: 'Funds can be stolen if',
    text: 'a contract receives a malicious code upgrade. There is no delay on code upgrades.',
    isCritical: true,
  }

function UPGRADE_WITH_DELAY_RISK(delay: string): ProjectRisk {
    return {
      category: 'Funds can be stolen if',
      text: `a contract receives a malicious code upgrade. There is a ${delay} days delay on code upgrades.`,
    }
  }
  
  function UPGRADE_WITH_DELAY_RISK_WITH_SC(delay: string): ProjectRisk {
    return {
      category: 'Funds can be stolen if',
      text: `a contract receives a malicious code upgrade. There is a ${delay} days delay on code upgrades unless upgrade is initiated by the \
      Security Council in which case there is no delay.`,
    }
  }
  
  function UPGRADE_WITH_DELAY_SECONDS_RISK(delaySeconds: number): ProjectRisk {
    if (delaySeconds < DANGER_DELAY_THRESHOLD_SECONDS) {
      return UPGRADE_NO_DELAY_RISK
    }
    const delay = formatSeconds(delaySeconds)
    return UPGRADE_WITH_DELAY_RISK(delay)
  }

  export const CONTRACTS = {
    UPGRADE_NO_DELAY_RISK,
    UPGRADE_WITH_DELAY_RISK,
    UPGRADE_WITH_DELAY_SECONDS_RISK,
    UPGRADE_WITH_DELAY_RISK_WITH_SC,
  }