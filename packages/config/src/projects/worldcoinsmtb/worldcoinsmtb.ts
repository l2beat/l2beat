import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PERFORMED_BY, PROOFS } from '../../common'
import type { BaseProject } from '../../types'

export const worldcoinsmtb: BaseProject = {
  id: ProjectId('worldcoinsmtb'),
  slug: 'worldcoin-smtb',
  name: 'Worldcoin SMTB',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-05-23')),
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
    description:
      'ZK program to add or delete users from the Worldcoin anonymity set.',
    links: {},
    badges: [],
  },
  proofVerification: {
    shortDescription:
      'ZK program to add or delete users from the Worldcoin anonymity set.',
    aggregation: false,
    verifiers: [
      {
        name: 'Size 100 Register',
        description: 'SMTB Register verifier of size 100.',
        contractAddress: EthereumAddress(
          '0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'yes',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'RegisterCircuitSize100',
            ...PROOFS.GROTH16('PPOT23'),
            link: 'https://github.com/worldcoin/semaphore-mtb/blob/113f8a8a4d2aecf42b9173fd0a52bef5120fcaec/prover/insertion_circuit.go',
          },
        ],
      },
      {
        name: 'Size 600 Register',
        description: 'SMTB Register verifier of size 600.',
        contractAddress: EthereumAddress(
          '0xFC1c26E964F791f81a33F49D91f79456891AA1c1',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'yes',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'RegisterCircuitSize600',
            ...PROOFS.GROTH16('PPOT26'),
            link: 'https://github.com/worldcoin/semaphore-mtb/blob/113f8a8a4d2aecf42b9173fd0a52bef5120fcaec/prover/insertion_circuit.go',
          },
        ],
      },
      {
        name: 'Size 1200 Register',
        description: 'SMTB Register verifier of size 1200.',
        contractAddress: EthereumAddress(
          '0xE44c83b9e1971A24EC698829297A0C4026B0CeF9',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'yes',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'RegisterCircuitSize1200',
            ...PROOFS.GROTH16('PPOT27'),
            link: 'https://github.com/worldcoin/semaphore-mtb/blob/113f8a8a4d2aecf42b9173fd0a52bef5120fcaec/prover/insertion_circuit.go',
          },
        ],
      },
      {
        name: 'Size 10 Delete',
        description: 'SMTB Delete verifier of size 10.',
        contractAddress: EthereumAddress(
          '0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'yes',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'DeleteCircuitSize10',
            ...PROOFS.GROTH16('PPOT19'),
            link: 'https://github.com/worldcoin/semaphore-mtb/blob/113f8a8a4d2aecf42b9173fd0a52bef5120fcaec/prover/deletion_circuit.go',
          },
        ],
      },
      {
        name: 'Size 100 Delete',
        description: 'SMTB Delete verifier of size 100.',
        contractAddress: EthereumAddress(
          '0x43B68ccBa7FC726540768fD1537c3179283140ed',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'yes',
        performedBy: PERFORMED_BY.l2beat,
        subVerifiers: [
          {
            name: 'DeleteCircuitSize100',
            ...PROOFS.GROTH16('PPOT22'),
            link: 'https://github.com/worldcoin/semaphore-mtb/blob/113f8a8a4d2aecf42b9173fd0a52bef5120fcaec/prover/deletion_circuit.go',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'Semaphore MTB',
        version: '113f8a8a4d2aecf42b9173fd0a52bef5120fcaec',
        link: 'https://github.com/worldcoin/semaphore-mtb',
      },
      {
        name: 'Semaphore MTB Setup',
        version: 'd46ef6be3eb0c43303d7e817f7d0c005530addf0',
        link: 'https://github.com/worldcoin/semaphore-mtb-setup',
      },
      {
        name: 'PTAU deserializer',
        version: '922115452ffdb4b92972e3b81277e5931fb90efa',
        link: 'https://github.com/worldcoin/ptau-deserializer',
      },
      {
        name: 'GNARK contract generator',
        version: '1eb487a151323cbc41ac4a6b7b24f71268d61be2',
        link: 'https://github.com/worldcoin/gnark-contract-generator',
      },
    ],
  },
}
