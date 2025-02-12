import { UnixTime } from '@l2beat/shared-pure'

export const PROJECT_COUNTDOWNS = {
  stageChanges: UnixTime.fromDate(new Date('2025-07-29T00:00:00Z')),
  otherMigration: UnixTime.fromDate(new Date('2025-06-19T00:00:00Z')),
}

export const REASON_FOR_BEING_OTHER = {
  NO_PROOFS: {
    label: 'No proofs',
    shortDescription: "The proof system isn't fully functional",
    description:
      'Projects without a proper proof system fully rely on single entities to safely update the state. A malicious proposer can finalize an invalid state, which can cause loss of funds.',
  },
  CLOSED_PROOFS: {
    label: 'Closed proofs',
    shortDescription:
      'There are less than 5 external actors that can submit challenges',
    description:
      'Projects without a sufficiently decentralized set of challengers rely on few entities to safely update the state. A small set of challengers can collude with the proposer to finalize an invalid state, which can cause loss of funds.',
  },
  NO_DA_ORACLE: {
    label: 'No DA bridge',
    shortDescription: 'There is no data availability bridge',
    description:
      'Projects without a data availability bridge fully rely on single entities (the sequencer) to honestly rely available data roots on Ethereum. A malicious sequencer can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  SMALL_DAC: {
    label: 'Small DAC',
    shortDescription:
      'There are less than 5 external actors that can attest data availability',
    description:
      'Projects without a sufficiently decentralized data availability committee rely on few entities to safely attest data availability on Ethereum. A small set of entities can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
  LOW_DAC_THRESHOLD: {
    label: 'Low DAC threshold',
    shortDescription: 'The data availability committee threshold is too low',
    description:
      'Projects with a low DAC threshold rely on the honesty of few entities to safely attest data availability on Ethereum. These entities can collude with the proposer to finalize an unavailable state, which can cause loss of funds.',
  },
} as const
