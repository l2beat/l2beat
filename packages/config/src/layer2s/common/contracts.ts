import { EthereumAddress } from '@l2beat/shared'

import { ProjectContractSingleAddress, ProjectRisk } from '../../common'
import { ProjectDiscovery } from './ProjectDiscovery'

const discovery = new ProjectDiscovery('starknet')

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

export const SHARP_VERIFIER_CONTRACT: ProjectContractSingleAddress = {
  name: 'GpsStatementVerifier',
  description:
    'Starkware SHARP verifier used collectively by StarkNet, Sorare, Immutable X and rhino.fi. It receives STARK proofs from the Prover attesting to the integrity of the Execution Trace of these four Programs including correctly computed L2 state root which is part of the Program Output.',
  address: EthereumAddress('0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60'),
  upgradeability: discovery.getContract('CallProxy').upgradeability,
}

export const CONTRACTS = {
  UNVERIFIED_DESCRIPTION,
  UNVERIFIED_RISK,
  UPGRADE_NO_DELAY_RISK,
  UPGRADE_WITH_DELAY_RISK,
}
