import { link } from 'fs'
import { identity } from 'lodash'
import { ZkCatalogProject } from './types/ZkCatalogProject'
import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export const worldcoin: ZkCatalogProject = {
  display: {
    slug: 'worldcoin',
    name: 'Worldcoin',
  },
  proofVerification: {
    aggregation: false,
    description:
      'Worldcoin uses two types of circuits: Semaphore to prove the inclusion of a WorldId in the anonymity set, and the Semaphore Merkle Tree Batcher (SMTB) to efficiently insert or delete users from the Semaphore Merkle trees.',
    verifiers: [
      {
        name: 'OpWorldID_Zero',
        description:
          "Semaphore verifier of size 30 for the 'phone' anonymity set.",
        contractAddress: EthereumAddress(
          '0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'failed',
        subVerifiers: [
          {
            name: 'Semaphore30',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            mainPCS: 'KZG',
            trustedSetup: 'PPTAU 14 + circuit specific',
            link: 'https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/src/semaphore.circom',
          },
        ],
      },
      {
        name: 'OpWorldID_One',
        description:
          "Semaphore verifier of size 30 for the 'orb' anonymity set.",
        contractAddress: EthereumAddress(
          '0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'failed',
        subVerifiers: [
          {
            name: 'Semaphore30',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            mainPCS: 'KZG',
            trustedSetup: 'PPTAU 14 + circuit specific',
            link: 'https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/src/semaphore.circom',
          },
        ],
      },
      {
        name: 'Size 100 Register',
        description: 'SMTB Register verifier of size 100.',
        contractAddress: EthereumAddress(
          '0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'RegisterVerifierSize100',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            trustedSetup: '',
            mainPCS: 'KZG',
          },
        ],
      },
      {
        name: 'Size 600 Register',
        description: 'SMTB Register verifier of size 600.',
        contractAddress: EthereumAddress(
          '0xFC1c26E964F791f81a33F49D91f79456891AA1c1',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'RegisterVerifierSize600',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            trustedSetup: '',
            mainPCS: 'KZG',
          },
        ],
      },
      {
        name: 'Size 1200 Register',
        description: 'SMTB Register verifier of size 1200.',
        contractAddress: EthereumAddress(
          '0xE44c83b9e1971A24EC698829297A0C4026B0CeF9',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'RegisterVerifierSize1200',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            trustedSetup: '',
            mainPCS: 'KZG',
          },
        ],
      },
      {
        name: 'Size 10 Delete',
        description: 'SMTB Delete verifier of size 10.',
        contractAddress: EthereumAddress(
          '0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'DeleteVerifierSize10',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            trustedSetup: '',
            mainPCS: 'KZG',
          },
        ],
      },
      {
        name: 'Size 100 Delete',
        description: 'SMTB Delete verifier of size 100.',
        contractAddress: EthereumAddress(
          '0x43B68ccBa7FC726540768fD1537c3179283140ed',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'DeleteVerifierSize100',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS',
            trustedSetup: '',
            mainPCS: 'KZG',
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
  type: 'zk-catalog',
}
