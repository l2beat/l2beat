export const REASON_FOR_BEING_OTHER = {
  NO_PROOFS: {
    type: 'proof-system',
    shortName: 'No proofs',
    shortDescription: 'A fully functional proof system',
    description:
      'Projects without a proof system fully rely on single entities to safely update the state of the rollup. A malicious proposer can finalize an invalid state, which can cause loss of funds.',
  },
  CLOSED_PROOFS: {
    type: 'proof-system',
    shortName: 'Closed proofs',
    shortDescription: 'A proof system with a small set of challengers',
    description:
      'Projects without a sufficiently decentralized set of challengers rely on few entities to safely update the state of the rollup. A small set of challengers can collude with the proposer to finalize an invalid state, which can cause loss of funds.',
  },
  NO_DA_ORACLE: {
    type: 'data-availability',
    shortName: 'No DA oracle',
    shortDescription: 'A data availability oracle',
    description:
      'Projects without a data availability oracle fully rely on single entities (the sequencer) to honestly rely available data roots on Ethereum. A malicious sequencer can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  SMALL_DAC: {
    type: 'data-availability',
    shortName: 'Small DAC',
    shortDescription:
      'At least 5 external actors that can attest data availability',
    description:
      'Projects without a sufficiently decentralized data availability committee rely on few entities to safely attest data availability on Ethereum. A small set of entities can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  LOW_DAC_THRESHOLD: {
    type: 'data-availability',
    shortName: 'Low DAC threshold',
    shortDescription: 'A higher threshold in the data availability committee',
    description: 'TODO TODO TODO',
  },
} as const

export type ReasonForBeingInOther =
  (typeof REASON_FOR_BEING_OTHER)[keyof typeof REASON_FOR_BEING_OTHER]
