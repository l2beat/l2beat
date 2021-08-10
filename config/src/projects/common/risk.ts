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
  sentiment: 'none',
}

export const SNARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-SNARK proofs',
  description:
    'ZK SNARKS prove that the state is correct, but require trusted setup',
  sentiment: 'warning',
}

export const STARK_PROOFS: ProjectRiskViewEntry = {
  value: 'ZK-STARK proofs',
  description: 'ZK STARKS prove that the state is correct',
  sentiment: 'none',
}

export const DATA_ON_CHAIN: ProjectRiskViewEntry = {
  value: 'On chain',
  description: 'All of the data needed for proof construction is published on chain',
  sentiment: 'good'
}

export const DATA_EXTERNAL: ProjectRiskViewEntry = {
  value: 'External',
  description: 'Proof construction relies fully on data that is NOT published on chain',
  sentiment: 'bad'
}

export const DATA_MIXED: ProjectRiskViewEntry = {
  value: 'Mixed',
  description: 'Some of the data needed for proof construction is not published on chain',
  sentiment: 'warning'
}

export const RISK = {
  UNKNOWN,
  FRAUD_PROOFS,
  SNARK_PROOFS,
  STARK_PROOFS,
  DATA_ON_CHAIN,
  DATA_MIXED,
  DATA_EXTERNAL,
}
