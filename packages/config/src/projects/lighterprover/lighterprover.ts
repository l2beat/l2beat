import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const lighterprover: BaseProject = {
  id: ProjectId('lighterprover'),
  slug: 'lighterprover',
  name: 'Lighter',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-10-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A ZK proving system designed by Lighter for proving their DEX L2 focused on trading perpetuals.',
    links: {
      websites: ['https://lighter.xyz'],
      documentation: ['https://docs.lighter.xyz'],
      repositories: [
        'https://github.com/elliottech/lighter-prover/tree/main',
        'https://github.com/elliottech',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Lighter',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Plonky2,
        ZK_CATALOG_TAGS.Field.Goldilocks,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
      finalWrap: [ZK_CATALOG_TAGS.Plonk.Gnark, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo: readProjectMarkdown('lighterprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('lighter'),
        sinceTimestamp: UnixTime(1759356000),
      },
    ],
    verifierHashes: [
      {
        hash: '0x16992bb868b32c1f4bd94d70267468928932f15df9b6ac22e62719f26b0eb221',
        name: 'Lighter verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xAa0b5b65890162C5C96D82F088822247EC5Df5D6',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'lighterprover',
          'verificationSteps-0x16992bb8',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      //     {
      //       hash: '0x8d5bf346c2d12732ea0b947623dcb66bfffa532e8c33d0b9493cffca41c8fa39',
      //       name: 'Lighter verifier',
      //       sourceLink:
      //         'https://github.com/elliottech/lighter-prover/tree/a07b2759345d53a29b22ebd97d815e4d443b59b0/circuit/src',
      //       proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
      //       knownDeployments: [
      //         {
      //           address: ChainSpecificAddress.fromLong(
      //             'ethereum',
      //             '0xb20De28D78b63bc0c94eef89Db53F6338af17825',
      //           ),
      //         },
      //       ],
      //       verificationStatus: 'successful',
      //       attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //       verificationSteps: `
      // The verification process below is based on the \`build_circuits.sh\` [script](https://github.com/elliottech/lighter-prover/blob/main/build_circuits.sh) in the lighter-prover repo. It consumed around 100 GiB of memory at the peak, so we recommend rerunning it on a machine with 128 GiB of RAM.

      // The steps below are for Ubuntu 22.04 OS.

      // 1. Install rust, gcc, go version 1.21 and later.

      // \`\`\`
      // curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
      // . .cargo/env

      // sudo apt update
      // sudo apt install build-essential

      // # one way to install latest go on Ubuntu 22.04
      // wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
      // sudo tar -xvf go1.21.0.linux-amd64.tar.gz
      // sudo mv go /usr/local
      // export GOROOT=/usr/local/go
      // export GOPATH=$HOME/go
      // export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
      // source ~/.profile
      // \`\`\`

      // 2. Run the correct version of the script to regenerate the keys.

      // \`\`\`
      // git clone https://github.com/elliottech/lighter-prover.git
      // cd lighter-prover
      // git checkout a07b2759345d53a29b22ebd97d815e4d443b59b0
      // chmod +x build_circuits.sh
      // ./build_circuits.sh
      // \`\`\`

      // The script will generate the \`final::....sol\` file that contains the verifier smart contract with the verification keys.
      //   `,
      //     },
      {
        // DesertVerifier
        hash: '0x6048c1a7d7e5439f458f927009811f3d95775d8b52775688db857cf6c70a816f',
        name: 'Lighter Desert verifier',
        sourceLink:
          'https://github.com/elliottech/lighter-prover/tree/aec951b36ffcdb67818ff7e237209d547b4bb78f/desertexit/circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x2aDBd91742B64105a097bC37D20Ebbca9a496085',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'lighterprover',
          'verificationSteps-0x6048c1a7',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
