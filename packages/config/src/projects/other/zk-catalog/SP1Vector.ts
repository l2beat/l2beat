import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { PROOFS } from './common/proofSystems'
import { ZkCatalogProject } from './types'

export const SP1Vector: ZkCatalogProject = {
  createdAt: new UnixTime(1726155706), // 2024-09-12T15:41:46Z
  display: {
    slug: 'SP1Vector',
    name: 'SP1Vector',
  },
  proofVerification: {
    shortDescription: 'Avail ZK light client implementation.',
    aggregation: true,
    verifiers: [
      {
        name: 'Vector SP1 Verifier - Frozen',
        description: 'Avail ZK light client verifying multiple blocks at once.',
        contractAddress: EthereumAddress(
          '0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-vector/blob/main/program/src/main.rs',
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
        name: 'Vector SP1 Verifier',
        description: 'Avail ZK light client verifying multiple blocks at once.',
        contractAddress: EthereumAddress(
          '0x1764C29FBd94865198588f10FC75D4f6636d158d',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Main program',
            ...PROOFS.PROGRAM,
            link: 'https://github.com/succinctlabs/sp1-vector/blob/main/program/src/main.rs',
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
  type: 'zk-catalog',
}
