import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ZkCatalogProject } from './types'

export const payy: ZkCatalogProject = {
  display: {
    slug: 'payy',
    name: 'Payy',
  },
  proofVerification: {
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
            proofSystem: 'Halo2',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/aggregate_agg/circuit.rs',
          },
        ],
      },
      {
        name: 'Mint Verifier',
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
            proofSystem: 'Halo2',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/mint/circuit.rs',
          },
        ],
      },
      {
        name: 'Burn Verifier',
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
            proofSystem: 'Halo2',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
            link: 'https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/burn/circuit.rs',
          },
        ],
      },
    ],
    requiredTools: [],
  },
  type: 'zk-catalog',
}
