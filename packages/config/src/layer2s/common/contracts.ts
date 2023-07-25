import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectContracts, ProjectRisk } from '../../common'
import { formatSeconds } from '../../utils/formatSeconds'
import { DANGER_DELAY_THRESHOLD_SECONDS } from './constants'

const UNVERIFIED_DESCRIPTION =
  'The source code of this contract is not verified on Etherscan.'

const UNVERIFIED_RISK: ProjectRisk = {
  category: 'Funds can be stolen if',
  text: 'the source code of unverified contracts contains malicious code.',
  isCritical: true,
}

const UPGRADE_NO_DELAY_RISK: ProjectRisk = {
  category: 'Funds can be stolen if',
  text: 'a contract receives a malicious code upgrade. There is no delay on code upgrades.',
  isCritical: true,
}

function UPGRADE_WITH_DELAY_RISK(delay: string): ProjectRisk {
  return {
    category: 'Funds can be stolen if',
    text: `a contract receives a malicious code upgrade. There is a ${delay} delay on code upgrades.`,
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

const EMPTY: ProjectContracts = {
  addresses: [],
  risks: [],
}

const ARBITRUM_OLD_BRIDGE = EthereumAddress(
  '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
)

const UNDER_REVIEW = {
  isUnderReview: true,
  addresses: [],
  risks: [],
}

export const CONTRACTS = {
  EMPTY,
  UNDER_REVIEW,
  UNVERIFIED_DESCRIPTION,
  UNVERIFIED_RISK,
  UPGRADE_NO_DELAY_RISK,
  UPGRADE_WITH_DELAY_RISK,
  UPGRADE_WITH_DELAY_SECONDS_RISK,
  UPGRADE_WITH_DELAY_RISK_WITH_SC,
  ARBITRUM_OLD_BRIDGE,
}
