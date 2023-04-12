import { EthereumAddress } from '@l2beat/shared'

import { ProjectContracts, ProjectRisk } from '../../common'

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

const EMPTY: ProjectContracts = {
  addresses: [],
  risks: [],
}

const ARBITRUM_OLD_BRIDGE = EthereumAddress(
  '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
)

export const CONTRACTS = {
  EMPTY,
  UNVERIFIED_DESCRIPTION,
  UNVERIFIED_RISK,
  UPGRADE_NO_DELAY_RISK,
  UPGRADE_WITH_DELAY_RISK,
  ARBITRUM_OLD_BRIDGE,
}
