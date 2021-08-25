import { ProjectRisk } from '../types'

const UNVERIFIED_DESCRIPTION =
  'The source code of this contract is not verified on Etherscan.'

const UNVERIFIED_RISK: ProjectRisk = {
  category: 'Funds can be stolen if',
  text: 'the source code of unverified contracts contains malicious code.',
}

const UPGRADE_NO_DELAY_RISK: ProjectRisk = {
  category: 'Funds can be stolen if',
  text: 'a contract receives a malicious code upgrade. There is no delay on code upgrades.',
}

function UPGRADE_WITH_DELAY_RISK(delay: string): ProjectRisk {
  return {
    category: 'Funds can be stolen if',
    text: `a contract receives a malicious code upgrade. There is a ${delay} delay on code upgrades.`,
  }
}

export const CONTRACTS = {
  UNVERIFIED_DESCRIPTION,
  UNVERIFIED_RISK,
  UPGRADE_NO_DELAY_RISK,
  UPGRADE_WITH_DELAY_RISK,
}
