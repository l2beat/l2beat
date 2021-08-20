import { ProjectTechnologyChoice } from '../types'

const FRAUD_PROOFS: ProjectTechnologyChoice = {
  name: 'Fraud proofs ensure state correctness',
  description:
    'The published state root is assumed to be correct. For a certain time period, usually one week anyone can submit a fraud proof that shows that the state was incorrect.',
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
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/off-chain-state#enforcing-consistency-on-the-on-chain-state',
    },
  ],
}

export const STATE_CORRECTNESS = {
  FRAUD_PROOFS,
  VALIDITY_PROOFS,
  STARKEX_VALIDITY_PROOFS,
}
