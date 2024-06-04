import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ZkCatalogProject } from './types/ZkCatalogProject'

export const worldcoinsemaphore: ZkCatalogProject = {
  display: {
    slug: 'worldcoin-semaphore',
    name: 'Worldcoin Semaphore',
  },
  proofVerification: {
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
        subVerifiers: [
          {
            name: 'Semaphore30',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'PPOT 14 + circuit specific',
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
        subVerifiers: [
          {
            name: 'Semaphore30',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'PPOT 14 + circuit specific',
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
  type: 'zk-catalog',
}
