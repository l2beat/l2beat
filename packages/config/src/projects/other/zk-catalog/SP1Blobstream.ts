import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { PROOFS } from './common/proofSystems'
import { ZkCatalogProject } from './types'

export const SP1Blobstream: ZkCatalogProject = {
  display: {
    slug: 'SP1Blobstream',
    name: 'SP1Blobstream',
  },
  proofVerification: {
    shortDescription: 'Celestia ZK light client implementation.',
    aggregation: false,
    verifiers: [
      {
        name: 'Blobstream SP1 Verifier (Ethereum)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky3',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/sp1',
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Base)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky3',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/sp1',
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Arbitrum One)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky3',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/sp1',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'SP1 zkVM',
        version: '?',
        link: 'https://github.com/succinctlabs/sp1',
      },
    ],
  },
  type: 'zk-catalog',
}
