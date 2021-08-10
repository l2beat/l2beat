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

export const RISK = {
  UNKNOWN,
  FRAUD_PROOFS,
  SNARK_PROOFS,
  STARK_PROOFS,
}
