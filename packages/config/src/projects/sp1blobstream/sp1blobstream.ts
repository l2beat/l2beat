import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PROOFS } from '../../common'
import type { BaseProject } from '../../types'

export const sp1blobstream: BaseProject = {
  id: ProjectId('sp1blobstream'),
  slug: 'sp1-blobstream',
  name: 'SP1Blobstream',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-04')),
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
    description: 'Celestia ZK light client implementation.',
    links: {},
    badges: [],
  },
  proofVerification: {
    shortDescription: 'Celestia ZK light client implementation.',
    aggregation: true,
    verifiers: [
      {
        name: 'Blobstream SP1 Verifier (Ethereum) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Base) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Arbitrum One) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0xc350F063C13a3Ca21331610fe159E697a5c9c2FB',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Ethereum) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Base) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Arbitrum One) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Ethereum) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0x1764C29FBd94865198588f10FC75D4f6636d158d',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Ethereum)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Base) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0x1764C29FBd94865198588f10FC75D4f6636d158d',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Base)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Arbitrum One) - Frozen',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0x1764C29FBd94865198588f10FC75D4f6636d158d',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
      {
        name: 'Blobstream SP1 Verifier (Arbitrum One)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-blobstream/blob/main/program/src/main.rs',
          },
          {
            name: 'Main circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/core',
          },
          {
            name: 'Recursion circuit',
            ...PROOFS.PLONKY3,
            link: 'https://github.com/succinctlabs/sp1/tree/dev/crates/recursion',
          },
          {
            name: 'Final wrap',
            ...PROOFS.PLONKSNARK('?'),
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: '?',
        version: '?',
        link: '?',
      },
    ],
  },
}
