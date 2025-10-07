import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const espressoprover: BaseProject = {
  id: ProjectId('espressoprover'),
  slug: 'espressoprover',
  name: 'Espresso',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-09-17')),
  display: {
    description:
      'Espresso Light Client prover generates a Plonk proof of the HotShot consenus of Espresso network.',
    links: {
      documentation: [
        'https://docs.espressosys.com/network/learn/the-espresso-network/internal-functionality/light-client',
      ],
      repositories: [
        'https://github.com/EspressoSystems/jellyfish',
        'https://github.com/EspressoSystems/espresso-network/tree/main/contracts/src',
      ],
    },
    badges: [],
  },
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  zkCatalogInfo: {
    creator: 'Espresso Systems',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Jellyfish,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
    },
    proofSystemInfo: `
    ## Description

    Espresso proof system implements a light client of HotShot consensus of Espresso network, i.e. it verifies that a sufficient number of Espresso nodes have correctly signed consensus message. It is implemented by a [Jellyfish Plonk](https://github.com/EspressoSystems/jellyfish) proof system on a [custom circuit](https://github.com/EspressoSystems/espresso-network/blob/2c166fe13a730733d18198d3989d3be2b4c42da8/hotshot-state-prover/src/v3/circuit.rs) that checks all necessary conditions. Jellyfish is a Rust implementation of [Plonk system](https://eprint.iacr.org/2019/953.pdf) without significant modifications. [This code](https://github.com/EspressoSystems/espresso-network/blob/2c166fe13a730733d18198d3989d3be2b4c42da8/contracts/rust/gen-vk-contract/src/main.rs) generates a Solidity verifier to check zk proofs within EVM.
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Jellyfish,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0x6f11ed19e494a0f332db714c267d743fe96eaf335405c82f24b6b40ba61a0d9e',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Jellyfish,
        knownDeployments: [
          {
            address: '0xa239397d05516d3e44bed853e7ba1e672ddd958f',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed flattened VerifyingKey structure returned by getVk() function on the verifier contract.',
      },
    ],
  },
}
