import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PROOFS } from '../../common'
import type { BaseProject } from '../../types'

export const payy: BaseProject = {
  // TODO: This should be part of the payy project, but upcomingL2 doesn't support this :(
  id: ProjectId('payy-zk-catalog'),
  slug: 'payy',
  name: 'Payy',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-07-17')),
  // tags
  isZkCatalog: true,
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'A privacy-preserving payment system.',
    links: {},
    badges: [],
  },
  proofVerification: {
    shortDescription: 'A privacy-preserving payment system.',
    aggregation: true,
    verifiers: [
      {
        name: 'Aggregate verifier',
        description: 'Combines multiple proofs into a single proof.',
        contractAddress: EthereumAddress(
          '0x31063c00ad62f9090abb9308f4549a1dee4a6362',
        ),
        chainId: ChainId.POLYGONPOS,
        verified: 'no',
        subVerifiers: [
          {
            name: 'AggregateVerifier',
            ...PROOFS.HALO2KZG('?'),
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/aggregate_agg/circuit.rs',
          },
        ],
      },
      {
        name: 'Mint verifier',
        description:
          'Allows a note to be created without a corresponding input.',
        contractAddress: EthereumAddress(
          '0xe025bb7ce28a4565a890a8d708faf9dd48ea1678',
        ),
        chainId: ChainId.POLYGONPOS,
        verified: 'no',
        subVerifiers: [
          {
            name: 'MintVerifier',
            ...PROOFS.HALO2KZG('?'),
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/mint/circuit.rs',
          },
        ],
      },
      {
        name: 'Burn verifier',
        description:
          'Allows a note to be used without a corresponding output, which, when proven, releases funds.',
        contractAddress: EthereumAddress(
          '0x4449d93873f7523d1b6cdfaa5a792e0867ca3a17',
        ),
        chainId: ChainId.POLYGONPOS,
        verified: 'no',
        subVerifiers: [
          {
            name: 'BurnVerifier',
            ...PROOFS.HALO2KZG('?'),
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/burn/circuit.rs',
          },
        ],
      },
    ],
    requiredTools: [],
  },
}
