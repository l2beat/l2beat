export const REASON_FOR_BEING_OTHER = {
  NO_PROOFS: {
    value: 'No proofs',
    description:
      'Projects without a proof system fully rely on single entities to safely update the state of the rollup. A malicious proposer can finalize an invalid state, which can cause loss of funds.',
  },
  CLOSED_PROOFS: {
    value: 'Closed proofs',
    description:
      'Projects without a sufficiently decentralized set of challengers rely on few entities to safely update the state of the rollup. A small set of challengers can collude with the proposer to finalize an invalid state, which can cause loss of funds.',
  },
  NO_DA_ORACLE: {
    value: 'No DA oracle',
    description:
      'Projects without a data availability oracle fully rely on single entities (the sequencer) to honestly rely available data roots on Ethereum. A malicious sequencer can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  SMALL_DAC: {
    value: 'Small DAC',
    description:
      'Projects without a sufficiently decentralized data availability committee rely on few entities to safely attest data availability on Ethereum. A small set of entities can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  LOW_DAC_THRESHOLD: {
    value: 'Low DAC threshold',
    description: 'TODO TODO TODO',
  },
} as const

export type ReasonForBeingInOther =
  (typeof REASON_FOR_BEING_OTHER)[keyof typeof REASON_FOR_BEING_OTHER]
