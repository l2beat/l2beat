import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { PROOFS } from './common/proofSystems'
import { ZkCatalogProject } from './types'

export const payy: ZkCatalogProject = {
  createdAt: new UnixTime(1721223308), // 2024-07-17T13:35:08Z
  display: {
    slug: 'payy',
    name: 'Payy',
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
  type: 'zk-catalog',
}
