import { ProjectRiskViewEntry } from '../types'

const UNKNOWN: ProjectRiskViewEntry = {
  value: 'Unknown',
  description: 'This information is currently missing on L2BEAT',
  sentiment: 'unknown',
}

export const FRAUD_PROOFS: ProjectRiskViewEntry = {
  value: 'Fraud proofs',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect',
}

export const SNARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-SNARK proofs',
  description:
    'SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup',
}

export const STARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-STARK proofs',
  description: 'STARKS are zero knowledge proofs that ensure state correctness',
}

export const DATA_ON_CHAIN: ProjectRiskViewEntry = {
  value: 'On chain',
  description:
    'All of the data needed for proof construction is published on chain',
}

export const DATA_EXTERNAL: ProjectRiskViewEntry = {
  value: 'External',
  description:
    'Proof construction relies fully on data that is NOT published on chain',
  sentiment: 'bad',
}

export const DATA_MIXED: ProjectRiskViewEntry = {
  value: 'Mixed',
  description:
    'Some of the data needed for proof construction is not published on chain',
  sentiment: 'warning',
}

export const UPGRADABLE: ProjectRiskViewEntry = {
  value: 'Upgradable',
  description:
    'The code that secures the system can be changed arbitrarily and without notice',
  sentiment: 'bad',
}

export function UPGRADE_DELAY(delay: string): ProjectRiskViewEntry {
  return {
    value: `${delay} delay`,
    description:
      'The code that secures the system can be changed arbitrarily but users have some time to react',
    sentiment: 'warning',
  }
}

export const IMMUTABLE: ProjectRiskViewEntry = {
  value: 'Immutable',
  description: 'The code that secures the system can never change',
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
}
