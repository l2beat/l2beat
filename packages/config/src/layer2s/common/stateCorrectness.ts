import { ProjectTechnologyChoice } from '../../common'

const FRAUD_PROOFS: ProjectTechnologyChoice = {
  name: 'Fraud proofs ensure state correctness',
  description:
    'After some period of time, the published state root is assumed to be correct. For a certain time period, usually one week anyone can submit a fraud proof that shows that the state was incorrect.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'there is no one that checks the published state. Fraud proofs assume at least one honest and able validator.',
    },
  ],
  references: [],
}

const VALIDITY_PROOFS: ProjectTechnologyChoice = {
  name: 'Validity proofs ensure state correctness',
  description:
    'Each update to the system state must be accompanied by a ZK Proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. Once the proof is processed on the Ethereum blockchain the L2 block is instantly finalized.',
  risks: [],
  references: [],
}

const STARKEX_VALIDITY_PROOFS: ProjectTechnologyChoice = {
  ...VALIDITY_PROOFS,
  description:
    VALIDITY_PROOFS.description +
    ' The system state is represented using Merkle roots.',
  references: [
    {
      text: 'Enforcing Consistency on the On-Chain State - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex/spot/shared/README-off-chain-state.html#enforcing_consistency_in_the_on_chain_state_spot',
    },
  ],
}

const EXIT_FRAUD_PROOFS: ProjectTechnologyChoice = {
  name: 'Fraud proofs apply to exits only',
  description:
    'The internal system state is not subject to any checks. Only exits from the system can be challenged. This places a much higher burden on potential validators, as they have to monitor all user activity and not only the single state.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'there are fraudulent exits which nobody reported. Fraud proofs assume that every exit is checked by at least one honest and able party.',
      isCritical: true,
    },
  ],
  references: [],
}

export const STATE_CORRECTNESS = {
  FRAUD_PROOFS,
  VALIDITY_PROOFS,
  STARKEX_VALIDITY_PROOFS,
  EXIT_FRAUD_PROOFS,
}
