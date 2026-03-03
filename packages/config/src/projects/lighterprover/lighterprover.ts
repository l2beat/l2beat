import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

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
    proofSystemInfo: `
## Description

Lighter prover is a zk proving system for Lighter L2 based on [Plonky2](https://github.com/0xPolygonZero/plonky2/tree/main) circuits. It verifies the logic for regular state transition of Lighter L2, as well as state transitions in the “desert mode” when L2 is shut down and users exit, using different sets of circuits. The circuits are proven with a STARK which is wrapped into a Plonk SNARK before settling onchain.

## Proof system

[Plonky2](https://github.com/0xPolygonZero/plonky2) implements a circuit aritmetization based on TurboPlonk over Goldilocks field, but it replaces KZG polynomial commitment scheme with a FRI-based polynomial testing scheme. In this way proving Plonky2 circuits requires no trusted setup, i.e. it is a STARK. 

However Lighter wraps these STARK in a [gnark](https://github.com/Consensys/gnark) implementation of Plonk over BN254 curve, which requires a trusted setup.

### Circuits

The proof system operates on Lighter STF circuits and desert mode circuits. All published circuits are available [here](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit), note that the Lighter team has not published the desert circuits yet. 

Lighter proof system defines circuits for proving all transactions, including internal, L1 and L2 transactions. The full list of available transactions that define Lighter STF can be seen [here](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/transactions). 

Transaction circuits use custom implementations for arithmetic operations ([bigint](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/bigint), [uint](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/uint)), cryptographic primitives ([ecdsa](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/ecdsa) on the Secp256k1 curve, [eddsa](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/eddsa) on the ECgFp5 curve, [keccak](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/keccak), [poseidon_bn128](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/poseidon_bn128)) and other helper circuits.

### Recursion

Lighter prover implements recursive aggregation of transaction proofs to make the whole pipeline more efficient and parallelizable. First, fixed-size blocks of consecutive transactions are processed and proven by [BlockTx circuit](https://github.com/elliottech/lighter-prover/blob/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/block_tx_constraints.rs), which can be done on separate machines. Next, arbitrary number of BlockTx proofs are aggregated into a single proof by [BlockTxChain circuit](https://github.com/elliottech/lighter-prover/blob/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/block_tx_chain_constraints.rs), which includes continuity checks across all BlockTx proofs.
`,
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
        hash: '0xcc7a955cdac9c7eee6db96238adf13925fda70f0f144347170cb59c3e9f1064d',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xa271df8660a318f155a31e64d0529ed85c2d1616',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The verification process below is based on the \`build_circuits.sh\` [script](https://github.com/elliottech/lighter-prover/blob/main/build_circuits.sh) in the lighter-prover repo. It consumed around 100 GiB of memory at the peak, so we recommend rerunning it on a machine with 128 GiB of RAM.

The steps below are for Ubuntu 22.04 OS.

1. Install rust, gcc, go version 1.21 and later.

\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt update
sudo apt install build-essential

# one way to install latest go on Ubuntu 22.04
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -xvf go1.21.0.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
source ~/.profile
\`\`\`

2. Run the correct version of the script to regenerate the keys.

\`\`\`
git clone https://github.com/elliottech/lighter-prover.git
cd lighter-prover
git checkout dd7d2182f7d9ec29ca452f410a5ffb1f3dc13925
chmod +x build_circuits.sh
./build_circuits.sh
\`\`\`

The script will generate the \`final::....sol\` file that contains the verifier smart contract with the verification keys.
  `,
      },
      //       {
      //         hash: '0x75868de49f3f6bccea3dd730d5ecfb198efc6d3bd6187d0289f1773571053a0a',
      //         proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
      //         knownDeployments: [
      //           {
      //             address: EthereumAddress(
      //               '0x6d456bCAAc437EAa3f8603E06C5850d88D3A48F7',
      //             ),
      //             chain: 'ethereum',
      //           },
      //         ],
      //         verificationStatus: 'successful',
      //         attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //         verificationSteps: `
      // The verification process below is based on the \`build_circuits.sh\` [script](https://github.com/elliottech/lighter-prover/blob/main/build_circuits.sh) in the lighter-prover repo. It consumed around 100 GiB of memory at the peak, so we recommend rerunning it on a machine with 128 GiB of RAM.

      // The steps below are for Ubuntu 24.04 OS.

      // 1. Install rust, gcc, go.

      // \`\`\`
      // curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
      // . .cargo/env

      // sudo apt update
      // sudo apt install build-essential golang-go
      // go version
      // \`\`\`

      // 2. Run the correct version of the script to regenerate the keys.

      // \`\`\`
      // git clone https://github.com/elliottech/lighter-prover.git
      // cd lighter-prover
      // git checkout e456205d9f4e25c1bf6eec33dac25d1b030e73d8
      // chmod +x build_circuits.sh
      // ./build_circuits.sh
      // \`\`\`

      // The script will generate the \`final::....sol\` file that contains the verifier smart contract with the verification keys.
      //   `,
      //       },
      {
        // DesertVerifier
        hash: '0xc3d58029fabf2a93d6cb9b96315c484e4bea2e238aaa081460c9027863c650e7',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xd4460475F00307845082d3a146f36661354FBc67',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'unsuccessful',
        verificationSteps:
          'The sources for desert verifier circuits are not published and thus the verifier cannot be independently regenerated.',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
