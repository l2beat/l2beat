import { ProjectRiskViewEntry } from '../types'

const UNKNOWN: ProjectRiskViewEntry = {
  value: 'Unknown',
  description: 'This information is currently missing on L2BEAT.',
  sentiment: 'unknown',
}

export const FRAUD_PROOFS: ProjectRiskViewEntry = {
  value: 'Fraud proofs',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect.',
}

export const SNARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-SNARK proofs',
  description:
    'SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
}

export const STARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-STARK proofs',
  description:
    'STARKS are zero knowledge proofs that ensure state correctness.',
}

export const DATA_ON_CHAIN: ProjectRiskViewEntry = {
  value: 'On chain',
  description:
    'All of the data needed for proof construction is published on chain.',
}

export const DATA_EXTERNAL: ProjectRiskViewEntry = {
  value: 'External',
  description:
    'Proof construction relies fully on data that is NOT published on chain.',
  sentiment: 'bad',
}

export const DATA_MIXED: ProjectRiskViewEntry = {
  value: 'Mixed',
  description:
    'Some of the data needed for proof construction is not published on chain.',
  sentiment: 'warning',
}

export const UPGRADABLE: ProjectRiskViewEntry = {
  value: 'Upgradable',
  description:
    'The code that secures the system can be changed arbitrarily and without notice.',
  sentiment: 'bad',
}

export function UPGRADE_DELAY(delay: string): ProjectRiskViewEntry {
  return {
    value: `${delay} delay`,
    description:
      'The code that secures the system can be changed arbitrarily but users have some time to react.',
    sentiment: 'warning',
  }
}

export const IMMUTABLE: ProjectRiskViewEntry = {
  value: 'Immutable',
  description: 'The code that secures the system can never change.',
}

export const NO_OWNER: ProjectRiskViewEntry = {
  value: 'No owner',
  description: 'The contracts are autonomous and do not require management.',
}

export const GOVERNANCE_OWNER: ProjectRiskViewEntry = {
  value: 'Governance',
  description: 'The contracts are managed by a token governance contract.',
}

export const MULTISIG_OWNER: ProjectRiskViewEntry = {
  value: 'Multisig',
  description:
    'The contracts are managed by a multisig contract. The owners of the multisig have a lot of power in the system.',
  sentiment: 'warning',
}

export const EOA_OWNER: ProjectRiskViewEntry = {
  value: 'Single key',
  description:
    'The contracts are managed by a single private key. This is a huge single point of failure.',
  sentiment: 'bad',
}

export const CLOSED_SYSTEM: ProjectRiskViewEntry = {
  value: 'Closed system',
  description: 'The creators limit who can access the system.',
  sentiment: 'bad',
}

export const FORCE_EXIT: ProjectRiskViewEntry = {
  value: 'Only force exit',
  description:
    'If users experience censorship they can trustlessly exit, but this is the only anti-censorship mechanism.',
  sentiment: 'warning',
}

export const FORCE_ANY_TRANSACTION: ProjectRiskViewEntry = {
  value: 'Any operation',
  description:
    'If users experience censorship they can force the rollup to execute any valid operation.',
}

export const NO_CENSORSHIP_PROTECTION: ProjectRiskViewEntry = {
  value: 'No protection',
  description: 'The users cannot escape from censorship.',
  sentiment: 'bad',
}

export const RISK = {
  UNKNOWN,
  FRAUD_PROOFS,
  SNARK_PROOFS,
  STARK_PROOFS,
  DATA_ON_CHAIN,
  DATA_MIXED,
  DATA_EXTERNAL,
  UPGRADABLE,
  UPGRADE_DELAY,
  IMMUTABLE,
  NO_OWNER,
  GOVERNANCE_OWNER,
  MULTISIG_OWNER,
  EOA_OWNER,
  CLOSED_SYSTEM,
  FORCE_EXIT,
  FORCE_ANY_TRANSACTION,
  NO_CENSORSHIP_PROTECTION,
}
