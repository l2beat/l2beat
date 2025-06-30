import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PERFORMED_BY, PROOFS } from '../../common'
import type { BaseProject } from '../../types'

export const worldcoinsemaphore: BaseProject = {
  id: ProjectId('worldcoinsemaphore'),
  slug: 'worldcoin-semaphore',
  name: 'Worldcoin Semaphore',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-06-04')),
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
    description: 'Anonymity set inclusion checker for the Worldcoin network.',
    links: {},
    badges: [],
  },
  proofVerification: {
    shortDescription:
      'Anonymity set inclusion checker for the Worldcoin network.',
    aggregation: false,
    verifiers: [
      {
        name: 'OpWorldID_Zero',
        description:
          "Semaphore verifier for the 'phone' anonymity set. It contains many subverifiers from size 16 to 32, but only the one with size 30 is being actively used. The verification appears as unsuccessful due to circom@2.0.3 not being deterministic when producing the r1cs file.",
        contractAddress: EthereumAddress(
          '0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'failed',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'Semaphore30',
            ...PROOFS.GROTH16('PPOT14'),
            link: 'https://github.com/semaphore-protocol/semaphore/blob/v2.0.0/circuits/semaphore.circom',
          },
        ],
      },
      {
        name: 'OpWorldID_One',
        description:
          "Semaphore verifier of size 30 for the 'orb' anonymity set. The verification appears as unsuccessful due to circom@2.0.3 not being deterministic when producing the r1cs file.",
        contractAddress: EthereumAddress(
          '0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'failed',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'Semaphore30',
            ...PROOFS.GROTH16('PPOT14'),
            link: 'https://github.com/semaphore-protocol/semaphore/blob/v2.0.0/circuits/semaphore.circom',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'snarkjs',
        version: 'v0.6.11',
        link: 'https://github.com/iden3/snarkjs/releases/tag/v0.6.11',
      },
      {
        name: 'circom',
        version: 'v2.0.3',
        link: 'https://github.com/iden3/circom/releases/tag/v2.0.3',
      },
    ],
  },
}
