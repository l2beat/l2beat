import { link } from 'fs'
import { identity } from 'lodash'
import { ZkCatalogProject } from './types/ZkCatalogProject'
import { EthereumAddress } from '@l2beat/shared-pure'

export const worldcoin: ZkCatalogProject = {
  display: {
    slug: 'worldcoin',
    name: 'Worldcoin',
    description:
      "Worldcoin is designed to become the world's largest privacy-preserving human identity and financial network.",
    link: 'https://worldcoin.org/',
  },
  proofVerification: {
    aggregation: false,
    verifiers: [
      {
        name: 'OpWorldID_Zero',
        description:
          "Semaphore verifier of size 30 for the 'phone' anonymity set.",
        contractAddress: EthereumAddress(
          '0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB',
        ),
        verified: 'no',
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
        verified: 'no',
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
        description: 'Register verifier of size 100.',
        contractAddress: EthereumAddress(
          '0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258',
        ),
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
        description: 'Register verifier of size 600.',
        contractAddress: EthereumAddress(
          '0xFC1c26E964F791f81a33F49D91f79456891AA1c1',
        ),
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
        description: 'Register verifier of size 1200.',
        contractAddress: EthereumAddress(
          '0xE44c83b9e1971A24EC698829297A0C4026B0CeF9',
        ),
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
        description: 'Delete verifier of size 10.',
        contractAddress: EthereumAddress(
          '0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1',
        ),
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
        description: 'Delete verifier of size 100.',
        contractAddress: EthereumAddress(
          '0x43B68ccBa7FC726540768fD1537c3179283140ed',
        ),
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
        name: 'snarkjs@0.6.11',
        description:
          'A JavaScript and Pure Web Assembly implementation of zkSNARK and PLONK schemes. It uses the Groth16 Protocol (3 point only and 3 pairings), PLONK and FFLONK.',
        link: 'https://github.com/iden3/snarkjs/releases/tag/v0.6.11',
      },
      {
        name: 'circom@2.0.3',
        description:
          'A domain-specific language for defining arithmetic circuits that can be used to generate zero-knowledge proofs.',
        link: 'https://github.com/iden3/circom/releases/tag/v2.0.3',
      },
    ],
  },
}
